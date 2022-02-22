const SmartBuffer = require('smart-buffer').SmartBuffer
const BitArray = require('../common/BitArrayNoSpan')
const ChunkSection = require('../common/PaletteChunkSection')
const BiomeSection = require('../common/PaletteBiome')
const CommonChunkColumn = require('../common/CommonChunkColumn')
const constants = require('../common/constants')

// wrap with func to provide version specific Block
module.exports = (Block, mcData) => {
  return class ChunkColumn extends CommonChunkColumn {
    static get section () { return ChunkSection }
    constructor (options) {
      super(mcData)
      this.minY = options?.minY ?? 0
      this.worldHeight = options?.worldHeight ?? constants.CHUNK_HEIGHT
      this.numSections = this.worldHeight >> 4

      this.sections = options?.sections ?? Array.from(
        { length: this.numSections }, _ => new ChunkSection()
      )
      this.biomes = options?.biomes ?? Array.from(
        { length: this.numSections }, _ => new BiomeSection()
      )

      this.skyLightMask = options?.skyLightMask ?? new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })
      this.emptySkyLightMask = options?.emptySkyLightMask ?? new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })
      this.skyLightSections = options?.skyLightSections ?? Array(
        this.numSections + 2
      ).fill(null)

      this.blockLightMask = options?.blockLightMask ?? new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })
      this.emptyBlockLightMask = options?.emptyBlockLightMask ?? new BitArray({
        bitsPerValue: 1,
        capacity: this.numSections + 2
      })
      this.blockLightSections = options?.blockLightSections ?? Array(
        this.numSections + 2
      ).fill(null)
      this.blockEntities = options?.blockEntities ?? {}
    }

    toJson () {
      return JSON.stringify({
        worldHeight: this.worldHeight,
        minY: this.minY,

        sections: this.sections.map(section => section.toJson()),
        biomes: this.biomes.map(biome => biome.toJson()),

        skyLightMask: this.skyLightMask.toLongArray(),
        emptySkyLightMask: this.emptySkyLightMask.toLongArray(),
        skyLightSections: this.skyLightSections.map(section => section === null ? null : section.toJson()),

        blockLightMask: this.blockLightMask.toLongArray(),
        emptyBlockLightMask: this.emptyBlockLightMask.toLongArray(),
        blockLightSections: this.blockLightSections.map(section => section === null ? null : section.toJson()),

        blockEntities: this.blockEntities
      })
    }

    static fromJson (j) {
      const parsed = JSON.parse(j)
      return new ChunkColumn({
        worldHeight: parsed.worldHeight,
        minY: parsed.minY,

        sections: parsed.sections.map(s => ChunkSection.fromJson(s)),
        biomes: parsed.biomes.map(s => BiomeSection.fromJson(s)),
        blockEntities: parsed.blockEntities,

        skyLightMask: BitArray.fromLongArray(parsed.skyLightMask, 1),
        emptySkyLightMask: BitArray.fromLongArray(parsed.emptyBlockLightMask, 1),
        skyLightSections: parsed.skyLightSections.map(s => s === null ? null : BitArray.fromJson(s)),

        blockLightMask: BitArray.fromLongArray(parsed.blockLightMask, 1),
        emptyBlockLightMask: BitArray.fromLongArray(parsed.emptySkyLightMask, 1),
        blockLightSections: parsed.blockLightSections.map(s => s === null ? null : BitArray.fromJson(s))
      })
    }

    initialize (func) {
      const p = { x: 0, y: 0, z: 0 }
      for (p.y = 0; p.y < this.worldHeight; p.y++) {
        for (p.z = 0; p.z < constants.SECTION_WIDTH; p.z++) {
          for (p.x = 0; p.x < constants.SECTION_WIDTH; p.x++) {
            const block = func(p.x, p.y, p.z)
            if (block !== null) { this.setBlock(p, block) }
          }
        }
      }
    }

    getBlock (pos) {
      const stateId = this.getBlockStateId(pos)
      const biome = this.getBiome(pos)
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
      // TODO: assert here if setting a block that should have an associated block entity
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
      return section ? section.get(toSectionPos(pos, this.minY)) : 0
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
      const biome = this.biomes[(pos.y - this.minY) >> 4]
      return biome ? biome.get(toBiomePos(pos, this.minY)) : 0
    }

    setBlockType (pos, id) {
      this.setBlockStateId(pos, mcData.blocks[id].minStateId)
    }

    setBlockData (pos, data) {
      this.setBlockStateId(pos, mcData.blocksByStateId[this.getBlockStateId(pos)].minStateId + data)
    }

    setBlockStateId (pos, stateId) {
      const section = this.sections[(pos.y - this.minY) >> 4]
      if (section) { section.set(toSectionPos(pos, this.minY), stateId) }
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

    setBiome (pos, biomeId) {
      const biome = this.biomes[(pos.y - this.minY) >> 4]
      if (biome) { biome.set(toBiomePos(pos), biomeId) }
    }

    getMask () {
      return undefined
    }

    dump () {
      const smartBuffer = new SmartBuffer()
      for (let i = 0; i < this.numSections; ++i) {
        this.sections[i].write(smartBuffer)
        this.biomes[i].write(smartBuffer)
      }
      return smartBuffer.toBuffer()
    }

    loadBiomes (biomes) {
    }

    dumpBiomes (biomes) {
      return undefined
    }

    load (data) {
      const reader = SmartBuffer.fromBuffer(data)
      for (let i = 0; i < this.numSections; ++i) {
        this.sections[i] = ChunkSection.read(reader)
        this.biomes[i] = BiomeSection.read(reader)
      }
    }

    loadParsedLight (skyLight, blockLight, skyLightMask, blockLightMask, emptySkyLightMask, emptyBlockLightMask) {
      function readSection (sections, data, lightMask, pLightMask, emptyMask, pEmptyMask) {
        let currentSectionIndex = 0
        const incomingLightMask = BitArray.fromLongArray(pLightMask, 1)
        const incomingEmptyMask = BitArray.fromLongArray(pEmptyMask, 1)

        for (let y = 0; y < sections.length; y++) {
          const isEmpty = incomingEmptyMask.get(y)
          if (!incomingLightMask.get(y) && !isEmpty) { continue }

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

    _loadBlockLightNibbles (y, buffer) {
      if (buffer.length !== 2048) throw new Error('Invalid light nibble buffer length ' + buffer.length)
      const minCY = this.minY >> 4
      this.blockLightMask.set(y + minCY + 1, 1) // minCY + 1 extra layer below
      this.blockLightSections[y - (this.minY >> 4) + 1] = new BitArray({
        bitsPerValue: 4,
        capacity: 4096,
        data: new Int8Array(buffer).buffer
      })
    }

    _loadSkyLightNibbles (y, buffer) {
      if (buffer.length !== 2048) throw new Error('Invalid light nibble buffer length: ' + buffer.length)
      const minCY = this.minY >> 4
      this.skyLightMask.set(y + minCY + 1, 1) // minCY + 1 extra layer below
      this.skyLightSections[y - minCY + 1] = new BitArray({
        bitsPerValue: 4,
        capacity: 4096,
        data: new Int8Array(buffer).buffer
      })
    }

    // Loads an disk serialized chunk
    loadSection (y, blockStates, biomes, blockLight, skyLight) {
      const minCY = this.minY >> 4
      const raiseUnknownBlock = block => { throw new Error(`Failed to map ${JSON.stringify(block)} to a block state ID`) }
      // TOOD: we should probably not fail, but because we use numerical biome IDs in pchunk we need to fail
      const raiseUnknownBiome = biome => { throw new Error(`Failed to map ${JSON.stringify(biome)} to a biome ID`) }
      this.sections[y - minCY] = ChunkSection.fromLocalPalette({
        data: BitArray.fromLongArray(blockStates.data || {}, blockStates.bitsPerBlock),
        palette: blockStates.palette
          .map(e => Block.fromProperties(e.Name.replace('minecraft:', ''), e.Properties || {}) ?? raiseUnknownBlock(e))
          .map(e => e.stateId)
      })

      this.biomes[y - minCY] = BiomeSection.fromLocalPalette({
        data: BitArray.fromLongArray(biomes.data || {}, biomes.bitsPerBiome),
        palette: biomes.palette
          .map(e => mcData.biomesByName[e.replace('minecraft:', '')] ?? raiseUnknownBiome(e))
          .map(e => e.id)
      })

      if (blockLight) this._loadBlockLightNibbles(y, blockLight)
      if (skyLight) this._loadSkyLightNibbles(y, skyLight)
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

function toBiomePos (pos, minY) {
  return { x: pos.x >> 2, y: ((pos.y - minY) & 0xF) >> 2, z: pos.z >> 2 }
}

function toSectionPos (pos, minY) {
  return { x: pos.x, y: (pos.y - minY) & 0xF, z: pos.z }
}

function getSectionBlockIndex (pos, minY) {
  return (((pos.y - minY) & 15) << 8) | (pos.z << 4) | pos.x
}
