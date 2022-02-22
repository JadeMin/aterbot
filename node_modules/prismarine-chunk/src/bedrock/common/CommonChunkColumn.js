const { Vec3 } = require('vec3')
const Stream = require('../common/Stream')
const nbt = require('prismarine-nbt')

const keyFromLocalPos = pos => `${pos.x},${pos.y},${pos.z}`
const keyFromGlobalPos = (x, y, z) => `${x & 0xf},${y},${z & 0xf}`

class CommonChunkColumn {
  minCY = 0
  maxCY = 16
  worldHeight = 256
  co = 0

  constructor (options, registry) {
    this.x = options.x || 0
    this.z = options.z || 0
    this.registry = registry
    this.chunkVersion = options.chunkVersion
    this.blockEntities = options.blockEntities || {}
    this.sections = []
    this.entities = {}
    // TODO: this can be defaulted to true
    this.compactOnSave = false
  }

  initialize (func) {
    const p = new Vec3()
    for (p.y = 0; p.y < this.worldHeight; p.y++) {
      for (p.z = 0; p.z < 16; p.z++) {
        for (p.x = 0; p.x < 16; p.x++) {
          const block = func(p.x, p.y, p.z)
          if (block) this.setBlock(p, block)
        }
      }
    }
  }

  // Blocks

  getBlock (vec4, full = true) {
    const Y = vec4.y >> 4
    const sec = this.sections[this.co + Y]
    if (!sec) return this.Block.fromStateId(this.registry.blocksByName.air.defaultState, 0)
    const block = sec.getBlock(vec4.l, vec4.x, vec4.y & 0xf, vec4.z, this.getBiomeId(vec4))
    if (full) {
      block.light = sec.blockLight.get(vec4.x, vec4.y & 0xf, vec4.z)
      block.skyLight = sec.skyLight.get(vec4.x, vec4.y & 0xf, vec4.z)
      block.entity = this.getBlockEntity(vec4)
    }
    return block
  }

  setBlock (pos, block) {
    const Y = pos.y >> 4
    let sec = this.sections[this.co + Y]
    if (!sec) {
      sec = new this.Section(this.registry, this.Block, { y: Y, subChunkVersion: this.subChunkVersion })
      this.sections[this.co + Y] = sec
    }
    sec.setBlock(pos.l, pos.x, pos.y & 0xf, pos.z, block)
    if (block.light !== undefined) sec.blockLight.set(pos.x, pos.y & 0xf, pos.z, block.light)
    if (block.skyLight !== undefined) sec.skyLight.set(pos.x, pos.y & 0xf, pos.z, block.skyLight)
    if (block.entity) this.setBlockEntity(pos, block.entity)
  }

  getBlockStateId (pos) {
    const Y = pos.y >> 4
    const sec = this.sections[this.co + Y]
    if (!sec) { return }
    return sec.getBlockStateId(pos.l, pos.x, pos.y & 0xf, pos.z)
  }

  setBlockStateId (pos, stateId) {
    const Y = pos.y >> 4
    let sec = this.sections[this.co + Y]
    if (!sec) {
      sec = new this.Section(this.registry, this.Block, { y: Y, subChunkVersion: this.subChunkVersion })
      this.sections[this.co + Y] = sec
    }
    sec.setBlockStateId(pos.l, pos.x, pos.y & 0xf, pos.z, stateId)
  }

  getBiomeId (pos) {
    return 0
  }

  setBiomeId (pos, biomeId) {
    // noop
  }

  getBlocks () {
    const arr = this.sections.map(sec => sec.getPalette()).flat(2)
    const deduped = Object.values(arr.reduce((acc, block) => {
      if (!acc[block.stateId]) acc[block.stateId] = block
      acc[block.stateId] = block
      return acc
    }, {}))
    return deduped
  }

  // Lighting
  setBlockLight (pos, light) {
    this.sections[this.co + (pos.y >> 4)].blockLight.set(pos.x, pos.y & 0xf, pos.z, light)
  }

  setSkyLight (pos, light) {
    this.sections[this.co + (pos.y >> 4)].skyLight.set(pos.x, pos.y & 0xf, pos.z, light)
  }

  getSkyLight (pos) {
    return this.sections[this.co + (pos.y >> 4)].skyLight.get(pos.x, pos.y & 0xf, pos.z)
  }

  getBlockLight (pos) {
    return this.sections[this.co + (pos.y >> 4)].blockLight.get(pos.x, pos.y & 0xf, pos.z)
  }

  // Block entities

  setBlockEntity (pos, tag) {
    this.blockEntities[keyFromLocalPos(pos)] = tag
  }

  getBlockEntity (pos) {
    return this.blockEntities[keyFromLocalPos(pos)]
  }

  addBlockEntity (tag) {
    const lPos = keyFromGlobalPos(tag.value.x.value, tag.value.y.value, tag.value.z.value)
    this.blockEntities[lPos] = tag
  }

  removeBlockEntity (pos) {
    delete this.blockEntities[keyFromLocalPos(pos)]
  }

  // This is only capable of moving block entities within the same chunk ... prismarine-world should implement this
  moveBlockEntity (pos, newPos) {
    const oldKey = keyFromLocalPos(pos)
    const newKey = keyFromLocalPos(newPos)
    const tag = this.blockEntities[oldKey]
    delete this.blockEntities[oldKey]
    this.blockEntities[newKey] = tag
  }

  // Entities
  addEntity (entityTag) {
    const key = entityTag.value.UniqueID.value.toString()
    this.entities[key] = entityTag
  }

  removeEntity (id) {
    delete this.entities[id]
  }

  // Section management

  getSection (y) {
    return this.sections[this.co + y]
  }

  setSection (y, section) {
    this.sections[this.co + y] = section
  }

  newSection (y, storageFormat, buffer) {
    if (storageFormat === undefined) {
      const n = this.Section.create(this.registry, this.Block, { y, subChunkVersion: this.subChunkVersion })
      this.setSection(y, n)
      return n
    } else {
      const n = new this.Section(this.registry, this.Block, { y, subChunkVersion: this.subChunkVersion })
      n.decode(storageFormat, buffer)
      this.setSection(y, n)
      return n
    }
  }

  getSectionBlockEntities (sectionY) {
    const found = []
    for (const key in this.blockEntities) {
      const y = parseInt(key.split(',')[1]) >> 4
      if (y === sectionY) {
        found.push(this.blockEntities[key])
      }
    }
    return found
  }

  getSections () {
    return this.sections
  }

  // Entities

  getEntities () {
    return this.entities
  }

  loadEntities (tags) {
    this.entities = tags
  }

  // Disk Encoding
  // Similar to network encoding, except without varints

  diskEncodeBlockEntities () {
    const tileBufs = []
    for (const key in this.blockEntities) {
      const tile = this.blockEntities[key]
      tileBufs.push(nbt.writeUncompressed(tile, 'little'))
    }
    return Buffer.concat(tileBufs)
  }

  diskEncodeEntities () {
    const entityBufs = []
    for (const entity in this.entities) {
      const tag = this.entities[entity]
      entityBufs.push(nbt.writeUncompressed(tag, 'little'))
    }
    return Buffer.concat(entityBufs)
  }

  diskDecodeBlockEntities (buffer) {
    if (!buffer) return
    const stream = buffer instanceof Buffer ? new Stream(buffer) : buffer
    let startOffset = stream.readOffset
    while (stream.peek() === 0x0A) {
      const { data, metadata } = nbt.protos.little.parsePacketBuffer('nbt', buffer, startOffset)
      stream.readOffset += metadata.size
      startOffset += metadata.size
      this.addBlockEntity(data)
    }
  }

  diskDecodeEntities (buffer) {
    if (!buffer) return
    const stream = buffer instanceof Buffer ? new Stream(buffer) : buffer
    let startOffset = stream.readOffset
    while (stream.peek() === 0x0A) {
      const { data, metadata } = nbt.protos.little.parsePacketBuffer('nbt', buffer, startOffset)
      stream.readOffset += metadata.size
      startOffset += metadata.size
      this.addEntity(data)
    }
  }

  toObject () {
    const sections = this.sections.map(sec => sec?.toObject())
    const { x, z, chunkVersion, blockEntities } = this
    return { x, z, chunkVersion, blockEntities, sections }
  }
}

module.exports = CommonChunkColumn
