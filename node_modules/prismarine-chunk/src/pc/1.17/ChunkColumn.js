const SmartBuffer = require('smart-buffer').SmartBuffer
const BitArray = require('../common/BitArrayNoSpan')
const ChunkSection = require('../common/CommonChunkSection')(BitArray)
const CommonChunkColumn = require('../common/CommonChunkColumn')
const constants = require('../common/constants')
const varInt = require('../common/varInt')

// wrap with func to provide version specific Block
module.exports = (Block, mcData) => {
  return class ChunkColumn extends CommonChunkColumn {
    static get section () { return ChunkSection }
    constructor (options) {
      super(mcData)
      this.minY = options?.minY ?? 0
      this.worldHeight = options?.worldHeight ?? constants.CHUNK_HEIGHT
      this.numSections = this.worldHeight >> 4

      this.sectionMask = new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections
      })
      this.sections = Array(this.numSections).fill(null)
      this.biomes = Array(4 * 4 * (this.worldHeight >> 2)).fill(0)

      this.skyLightMask = new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })
      this.emptySkyLightMask = new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })

      this.skyLightSections = Array(this.numSections + 2).fill(null)

      this.blockLightMask = new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })
      this.emptyBlockLightMask = new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })

      this.blockLightSections = Array(this.numSections + 2).fill(null)
    }

    // Json serialization/deserialization methods
    toJson () {
      return JSON.stringify({
        biomes: this.biomes,
        blockEntities: this.blockEntities,
        sectionMask: this.sectionMask.toLongArray(),
        sections: this.sections.map(section => section === null ? null : section.toJson()),

        skyLightMask: this.skyLightMask.toLongArray(),
        blockLightMask: this.blockLightMask.toLongArray(),

        skyLightSections: this.skyLightSections.map(section => section === null ? null : section.toJson()),
        blockLightSections: this.blockLightSections.map(section => section === null ? null : section.toJson()),

        emptyBlockLightMask: this.emptyBlockLightMask.toLongArray(),
        emptySkyLightMask: this.emptySkyLightMask.toLongArray()
      })
    }

    static fromJson (j) {
      const parsed = JSON.parse(j)
      const chunk = new ChunkColumn()
      chunk.biomes = parsed.biomes
      chunk.blockEntities = parsed.blockEntities
      chunk.sectionMask = BitArray.fromLongArray(parsed.sectionMask, 1)
      chunk.sections = parsed.sections.map(s => s === null ? null : ChunkSection.fromJson(s))

      chunk.skyLightMask = BitArray.fromLongArray(parsed.skyLightMask, 1)
      chunk.blockLightMask = BitArray.fromLongArray(parsed.blockLightMask, 1)

      chunk.skyLightSections = parsed.skyLightSections.map(s => s === null ? null : BitArray.fromJson(s))
      chunk.blockLightSections = parsed.blockLightSections.map(s => s === null ? null : BitArray.fromJson(s))

      chunk.emptySkyLightMask = BitArray.fromLongArray(parsed.emptyBlockLightMask, 1)
      chunk.emptyBlockLightMask = BitArray.fromLongArray(parsed.emptySkyLightMask, 1)

      return chunk
    }

    initialize (func) {
      const p = { x: 0, y: 0, z: 0 }
      for (p.y = 0; p.y < this.worldHeight; p.y++) {
        for (p.z = 0; p.z < constants.SECTION_WIDTH; p.z++) {
          for (p.x = 0; p.x < constants.SECTION_WIDTH; p.x++) {
            const block = func(p.x, p.y, p.z)
            if (block === null) {
              continue
            }
            this.setBlock(p, block)
          }
        }
      }
    }

    getBlock (pos) {
      const section = this.sections[(pos.y - this.minY) >> 4]
      const biome = this.getBiome(pos)
      if (!section) {
        return Block.fromStateId(0, biome)
      }
      const stateId = section.getBlock(toSectionPos(pos, this.minY))
      const block = Block.fromStateId(stateId, biome)
      block.light = this.getBlockLight(pos)
      block.skyLight = this.getSkyLight(pos)
      block.entity = this.getBlockEntity(pos)
      return block
    }

    setBlock (pos, block) {
      if (typeof block.stateId !== 'undefined') {
        this.setBlockStateId(pos, block.stateId)
      }
      if (typeof block.biome !== 'undefined') {
        this.setBiome(pos, block.biome.id)
      }
      if (typeof block.skyLight !== 'undefined') {
        this.setSkyLight(pos, block.skyLight)
      }
      if (typeof block.light !== 'undefined') {
        this.setBlockLight(pos, block.light)
      }
      if (block.entity) {
        this.setBlockEntity(pos, block.entity)
      } else {
        this.removeBlockEntity(pos)
      }
    }

    getBlockType (pos) {
      const blockStateId = this.getBlockStateId(pos)
      return mcData.blocksByStateId[blockStateId].id
    }

    getBlockData (pos) {
      const blockStateId = this.getBlockStateId(pos)
      return mcData.blocksByStateId[blockStateId].metadata
    }

    getBlockStateId (pos) {
      const section = this.sections[(pos.y - this.minY) >> 4]
      return section ? section.getBlock(toSectionPos(pos, this.minY)) : 0
    }

    getBlockLight (pos) {
      const section = this.blockLightSections[getLightSectionIndex(pos, this.minY)]
      return section ? section.get(getSectionBlockIndex(pos, this.minY)) : 0
    }

    getSkyLight (pos) {
      const section = this.skyLightSections[getLightSectionIndex(pos, this.minY)]
      return section ? section.get(getSectionBlockIndex(pos, this.minY)) : 0
    }

    getBiome (pos) {
      if (pos.y < this.minY || pos.y >= (this.minY + this.worldHeight)) return 0
      return this.biomes[getBiomeIndex(pos, this.minY)]
    }

    setBlockType (pos, id) {
      this.setBlockStateId(pos, mcData.blocks[id].minStateId)
    }

    setBlockData (pos, data) {
      this.setBlockStateId(pos, mcData.blocksByStateId[this.getBlockStateId(pos)].minStateId + data)
    }

    setBlockStateId (pos, stateId) {
      const sectionIndex = (pos.y - this.minY) >> 4
      if (sectionIndex < 0 || sectionIndex >= this.numSections) return

      let section = this.sections[sectionIndex]
      if (!section) {
        // if it's air
        if (stateId === 0) {
          return
        }
        section = new ChunkSection()
        if (sectionIndex > this.sectionMask.capacity) {
          this.sectionMask = this.sectionMask.resize(sectionIndex)
        }
        this.sectionMask.set(sectionIndex, 1)
        this.sections[sectionIndex] = section
      }

      section.setBlock(toSectionPos(pos, this.minY), stateId)
    }

    setBlockLight (pos, light) {
      const sectionIndex = getLightSectionIndex(pos, this.minY)
      let section = this.blockLightSections[sectionIndex]

      if (section === null) {
        if (light === 0) {
          return
        }
        section = new BitArray({
          bitsPerValue: 4,
          capacity: 4096
        })
        if (sectionIndex > this.blockLightMask.capacity) {
          this.blockLightMask = this.blockLightMask.resize(sectionIndex)
        }
        this.blockLightMask.set(sectionIndex, 1)
        this.blockLightSections[sectionIndex] = section
      }

      section.set(getSectionBlockIndex(pos, this.minY), light)
    }

    setSkyLight (pos, light) {
      const sectionIndex = getLightSectionIndex(pos, this.minY)
      let section = this.skyLightSections[sectionIndex]

      if (section === null) {
        if (light === 0) {
          return
        }
        section = new BitArray({
          bitsPerValue: 4,
          capacity: 4096
        })
        this.skyLightMask.set(sectionIndex, 1)
        this.skyLightSections[sectionIndex] = section
      }

      section.set(getSectionBlockIndex(pos, this.minY), light)
    }

    setBiome (pos, biome) {
      if (pos.y < this.minY || pos.y >= (this.minY + this.worldHeight)) return
      this.biomes[getBiomeIndex(pos, this.minY)] = biome
    }

    getMask () {
      return this.sectionMask.toLongArray()
    }

    dump () {
      const smartBuffer = new SmartBuffer()
      this.sections.forEach((section) => {
        if (section !== null && !section.isEmpty()) {
          section.write(smartBuffer)
        }
      })
      return smartBuffer.toBuffer()
    }

    loadBiomes (biomes) {
      this.biomes = biomes
    }

    dumpBiomes (biomes) {
      return this.biomes
    }

    load (data, bitMap = [[0, 0xffff]]) {
      const reader = SmartBuffer.fromBuffer(data)
      bitMap = BitArray.fromLongArray(bitMap, 1)

      this.sectionMask = BitArray.or(this.sectionMask, bitMap)

      for (let y = 0; y < this.numSections; ++y) {
        // skip sections not present in the data
        if (!bitMap.get(y)) {
          continue
        }

        // keep temporary palette
        let palette

        const solidBlockCount = reader.readInt16BE()

        // get number of bits a palette item use
        const bitsPerBlock = reader.readUInt8()

        // check if the section uses a section palette
        if (bitsPerBlock <= constants.MAX_BITS_PER_BLOCK) {
          palette = []
          // get number of palette items
          const numPaletteItems = varInt.read(reader)

          // save each palette item
          for (let i = 0; i < numPaletteItems; ++i) {
            palette.push(varInt.read(reader))
          }
        } else {
          // global palette is used
          palette = null
        }

        // number of items in data array
        varInt.read(reader) // numLongs
        const dataArray = new BitArray({
          bitsPerValue: bitsPerBlock,
          capacity: 4096
        }).readBuffer(reader)

        this.sections[y] = new ChunkSection({
          data: dataArray,
          palette,
          solidBlockCount
        })
      }
    }

    loadParsedLight (skyLight, blockLight, skyLightMask, blockLightMask, emptySkyLightMask, emptyBlockLightMask) {
      function readSection (sections, data, lightMask, pLightMask, emptyMask, pEmptyMask) {
        let currentSectionIndex = 0
        const incomingLightMask = BitArray.fromLongArray(pLightMask, 1)
        const incomingEmptyMask = BitArray.fromLongArray(pEmptyMask, 1)

        for (let y = 0; y < sections.length; y++) {
          const isEmpty = incomingEmptyMask.get(y)
          if (!incomingLightMask.get(y) && !isEmpty) {
            continue
          }

          emptyMask.set(y, isEmpty)
          lightMask.set(y, 1 - isEmpty)

          const bitArray = new BitArray({
            bitsPerValue: 4,
            capacity: 4096
          })
          sections[y] = bitArray

          if (!isEmpty) {
            const sectionReader = Buffer.from(data[currentSectionIndex++])
            bitArray.readBuffer(SmartBuffer.fromBuffer(sectionReader))
          }
        }
      }

      readSection(this.skyLightSections, skyLight, this.skyLightMask, skyLightMask, this.emptySkyLightMask, emptySkyLightMask)
      readSection(this.blockLightSections, blockLight, this.blockLightMask, blockLightMask, this.emptyBlockLightMask, emptyBlockLightMask)
    }

    dumpLight () {
      const skyLight = []
      const blockLight = []

      this.skyLightSections.forEach((section, index) => {
        if (section !== null && this.skyLightMask.get(index)) {
          const smartBuffer = new SmartBuffer()
          section.writeBuffer(smartBuffer)
          skyLight.push(Uint8Array.from(smartBuffer.toBuffer()))
        }
      })

      this.blockLightSections.forEach((section, index) => {
        if (section !== null && this.blockLightMask.get(index)) {
          const smartBuffer = new SmartBuffer()
          section.writeBuffer(smartBuffer)
          blockLight.push(Uint8Array.from(smartBuffer.toBuffer()))
        }
      })

      return {
        skyLight,
        blockLight,
        skyLightMask: this.skyLightMask.toLongArray(),
        blockLightMask: this.blockLightMask.toLongArray(),
        emptySkyLightMask: this.emptySkyLightMask.toLongArray(),
        emptyBlockLightMask: this.emptyBlockLightMask.toLongArray()
      }
    }
  }
}

function getLightSectionIndex (pos, minY) {
  return Math.floor((pos.y - minY) / 16) + 1
}

function getBiomeIndex (pos, minY) {
  return (((pos.y - minY) >> 2) & 63) << 4 | ((pos.z >> 2) & 3) << 2 | ((pos.x >> 2) & 3)
}

function toSectionPos (pos, minY) {
  return { x: pos.x, y: (pos.y - minY) & 15, z: pos.z }
}

function getSectionBlockIndex (pos, minY) {
  return (((pos.y - minY) & 15) << 8) | (pos.z << 4) | pos.x
}
