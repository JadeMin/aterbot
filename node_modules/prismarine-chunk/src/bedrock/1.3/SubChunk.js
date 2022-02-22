const PalettedStorage = require('../common/PalettedStorage')
const { StorageType } = require('../common/constants')
const { getChecksum } = require('../common/util')
const neededBits = require('../../pc/common/neededBits')
const Stream = require('../common/Stream')
const nbt = require('prismarine-nbt')

class SubChunk {
  constructor (registry, Block, options = {}) {
    this.registry = registry
    if (!registry) {
      throw new Error('registry is required')
    }
    this.Block = Block
    this.y = options.y
    this.palette = options.palette || []
    this.blocks = []
    if (options.blocks) {
      for (const block of options.blocks) {
        this.blocks.push(PalettedStorage.copyFrom(block))
      }
    }
    this.subChunkVersion = options.subChunkVersion || 8
    this.hash = options.hash || null
    this.updated = options.updated || true

    // Not written or read
    this.blockLight = options.blockLight ? PalettedStorage.copyFrom(options.blockLight) : new PalettedStorage(4)
    this.skyLight = options.skyLight ? PalettedStorage.copyFrom(options.skyLight) : new PalettedStorage(4)
  }

  // Creates an air chunk
  static create (registry, Block, y) {
    const subChunk = new this(registry, Block, { y })
    // Fill first layer with zero
    subChunk.blocks.push(new PalettedStorage(1))
    subChunk.palette.push([])
    // Set zero to be air, Add to the palette
    subChunk.addToPalette(0, subChunk.registry.blocksByName.air.defaultState, 4096)
    return subChunk
  }

  decode (format, stream) {
    if (stream instanceof Buffer) stream = new Stream(stream)
    // version
    this.subChunkVersion = stream.readByte()
    let storageCount = 1

    switch (this.subChunkVersion) {
      case 1:
        // This is a old SubChunk format that only has one layer - no need to read storage count
        // But when re-encoding, we want to use v8 to not loose data
        this.subChunkVersion = 8
        break
      case 8:
      case 9:
        storageCount = stream.readByte()
        if (this.subChunkVersion >= 9) {
          this.y = stream.readByte() // Sub Chunk Index
        }
        if (storageCount > 2) {
          // This is technically not an error, but not currently aware of any servers
          // that send more than two layers. If this is a problem, this check can be
          // safely removed. Just keeping it here as a sanity check.
          throw new Error('Expected storage count to be 1 or 2, got ' + storageCount)
        }
        break
      default:
        throw new Error('Unsupported sub chunk version: ' + this.subChunkVersion)
    }

    for (let i = 0; i < storageCount; i++) {
      const paletteType = stream.readByte()
      const usingNetworkRuntimeIds = paletteType & 1

      if (!usingNetworkRuntimeIds && (format === StorageType.Runtime)) {
        throw new Error(`Expected network encoding while decoding SubChunk at y=${this.y}`)
      }

      const bitsPerBlock = paletteType >> 1
      this.loadPalettedBlocks(i, stream, bitsPerBlock, format)
    }
  }

  loadPalettedBlocks (storageLayer, stream, bitsPerBlock, format) {
    const storage = new PalettedStorage(bitsPerBlock)
    storage.read(stream)
    this.blocks[storageLayer] = storage

    const paletteSize = format === StorageType.LocalPersistence ? stream.readUInt32LE() : stream.readZigZagVarInt()
    if (paletteSize > stream.buffer.length || paletteSize < 1) throw new Error(`Invalid palette size: ${paletteSize}`)

    if (format === StorageType.Runtime) {
      this.loadRuntimePalette(storageLayer, stream, paletteSize)
    } else {
      // Either "network persistent" (network with caching on <1.18) or local disk
      this.loadLocalPalette(storageLayer, stream, paletteSize, format === StorageType.NetworkPersistence)
    }

    this.blocks[storageLayer].incrementPalette(this.palette[storageLayer])
  }

  loadRuntimePalette (storageLayer, stream, paletteSize) {
    this.palette[storageLayer] = []

    for (let i = 0; i < paletteSize; i++) {
      const index = stream.readZigZagVarInt()
      const block = this.registry.blockStates[index]
      this.palette[storageLayer][i] = { stateId: index, ...block, count: 0 }
    }
  }

  loadLocalPalette (storageLayer, stream, paletteSize, overNetwork) {
    this.palette[storageLayer] = []
    const buf = stream.buffer
    let startOffset = stream.readOffset
    let i
    for (i = 0; i < paletteSize; i++) {
      const { metadata, data } = nbt.protos[overNetwork ? 'littleVarint' : 'little'].parsePacketBuffer('nbt', buf, startOffset)
      stream.readOffset += metadata.size // BinaryStream
      startOffset += metadata.size // Buffer

      const { name, states, version } = nbt.simplify(data)

      let block = this.Block.fromProperties(name.replace('minecraft:', ''), states ?? {}, 0)

      if (!block) {
        // This is not a valid block
        debugger // eslint-disable-line
        block = this.Block.fromProperties('air', {}, 0)
      }

      this.palette[storageLayer][i] = { stateId: block.stateId, name, states: data.value.states.value, version, count: 0 }
    }

    if (i !== paletteSize) {
      throw new Error(`Expected ${paletteSize} blocks, got ${i}`)
    }
  }

  async encode (format, checksum = false, compact = true) {
    const stream = new Stream()

    if (this.subChunkVersion >= 8) {
      this.encodeV8(stream, format, compact)
    } else {
      throw new Error('Unsupported sub chunk version')
    }

    const buf = stream.getBuffer()
    if (checksum) {
      this.hash = await getChecksum(buf)
      this.updated = false
    }
    return buf
  }

  // Encode sub chunk version 8+
  encodeV8 (stream, format, compact) {
    stream.writeUInt8(this.subChunkVersion)
    stream.writeUInt8(this.blocks.length)
    if (this.subChunkVersion >= 9) { // Caves and cliffs (1.17-1.18)
      stream.writeUInt8(this.y)
    }
    for (let l = 0; l < this.blocks.length; l++) {
      if (compact) this.compact(l) // Compact before encoding
      this.writeStorage(stream, l, format)
    }
  }

  writeStorage (stream, storageLayer, format) {
    const storage = this.blocks[storageLayer]
    let paletteType = storage.bitsPerBlock << 1
    if (format === StorageType.Runtime) {
      paletteType |= 1
    }
    stream.writeUInt8(paletteType)
    storage.write(stream)

    if (format === StorageType.LocalPersistence) {
      stream.writeUInt32LE(this.palette[storageLayer].length)
    } else {
      stream.writeZigZagVarInt(this.palette[storageLayer].length)
    }

    if (format === StorageType.Runtime) {
      for (const block of this.palette[storageLayer]) {
        stream.writeZigZagVarInt(block.stateId)
      }
    } else {
      for (const block of this.palette[storageLayer]) {
        const { name, states, version } = block
        const tag = nbt.comp({ name: nbt.string(name), states: nbt.comp(states), version: nbt.int(version) })
        const buf = nbt.writeUncompressed(tag, format === StorageType.LocalPersistence ? 'little' : 'littleVarint')
        stream.writeBuffer(buf)
      }
    }
  }

  // Normal block access

  getBlock (l, x, y, z, biomeId) {
    if (l !== undefined) {
      const stateId = this.getBlockStateId(l, x, y, z)
      return this.Block.fromStateId(stateId, biomeId)
    } else {
      const layer1 = this.getBlockStateId(0, x, y, z)
      const layer2 = this.getBlockStateId(1, x, y, z)
      const block = this.Block.fromStateId(layer1)
      if (layer2) {
        block.superimposed = this.Block.fromStateId(layer2, biomeId)
        const name = block.superimposed.name
        // TODO: Snowy blocks have to be handled in prismarine-viewer
        if (name.includes('water')) {
          block.computedStates.waterlogged = true
        }
      }
      return block
    }
  }

  setBlock (l, x, y, z, block) {
    if (l !== undefined) {
      this.setBlockStateId(l, x, y, z, block.stateId)
    } else {
      this.setBlockStateId(0, x, y, z, block.stateId)
      if (block.superimposed) {
        this.setBlockStateId(1, x, y, z, block.superimposed.stateId)
      }
    }
    this.updated = true
  }

  getBlockStateId (l = 0, x, y, z) {
    const blocks = this.blocks[l]
    if (!blocks) {
      return this.registry.blocksByName.air.defaultState
    }
    return this.palette[l][blocks.get(x, y, z)].stateId
  }

  setBlockStateId (l = 0, x, y, z, stateId) {
    if (!this.palette[l]) {
      this.palette[l] = []
      this.blocks[l] = new PalettedStorage(4) // Zero initialized
      this.addToPalette(l, this.registry.blocksByName.air.defaultState, 4096 - 1)
      this.addToPalette(l, stateId, 1)
      this.blocks[l].set(x, y, z, this.palette[l].length - 1)
    } else {
      // Decrement count of old block
      const currentIndex = this.blocks[l].get(x, y, z)
      const currentEntry = this.palette[l][currentIndex]
      if (currentEntry.stateId === stateId) {
        return // No change
      }
      currentEntry.count--

      for (let i = 0; i < this.palette[l].length; i++) {
        const entry = this.palette[l][i]
        if (entry.stateId === stateId) {
          entry.count = Math.max(entry.count, 0) + 1
          this.blocks[l].set(x, y, z, i)
          return
        }
      }

      this.addToPalette(l, stateId, 1)
      this.blocks[l].set(x, y, z, this.palette[l].length - 1)
    }
    this.updated = true
  }

  addToPalette (l, stateId, count = 0) {
    const block = this.registry.blockStates[stateId]
    this.palette[l].push({ stateId, name: block.name, states: block.states, count })
    const minBits = neededBits(this.palette[l].length - 1)
    if (minBits > this.blocks[l].bitsPerBlock) {
      this.blocks[l] = this.blocks[l].resize(minBits)
    }
  }

  // These compation functions reduces the size of the chunk by removing unused blocks
  // and reordering the palette to reduce the number of bits per block
  isCompactable (layer) {
    let newPaletteLength = 0
    for (const block of this.palette[layer]) {
      if (block.count > 0) {
        newPaletteLength++
      }
    }
    return newPaletteLength < this.palette[layer].length
  }

  compact (layer) {
    const newPalette = []
    const map = []
    for (const block of this.palette[layer]) {
      if (block.count > 0) {
        newPalette.push(block)
      }
      map.push(newPalette.length - 1)
    }

    if (newPalette.length === this.palette[layer].length) {
      return
    }

    const newStorage = new PalettedStorage(neededBits(newPalette.length - 1))
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        for (let z = 0; z < 16; z++) {
          const ix = this.blocks[layer].get(x, y, z)
          newStorage.set(x, y, z, map[ix])
        }
      }
    }
    this.blocks[layer] = newStorage
    this.palette[layer] = newPalette
  }

  /**
   * Gets the block runtime ID at the layer and position
   * @returns Global block palette (runtime) ID for the block
   */
  getPaletteEntry (l, x, y, z) {
    return this.palette[l][this.blocks[l].get(x, y, z)]
  }

  getPalette (layer = 0) {
    return this.palette[layer].filter(block => block.count > 0)
  }

  // Lighting - Not written or read, but computed during chunk loading
  getBlockLight (x, y, z) {
    return this.blockLight.get(x, y, z)
  }

  setBlockLight (x, y, z, value) {
    this.blockLight.set(x, y, z, value)
  }

  getSkyLight (x, y, z) {
    return this.skyLight.get(x, y, z)
  }

  setSkyLight (x, y, z, value) {
    this.skyLight.set(x, y, z, value)
  }

  toObject () {
    return {
      y: this.y,
      palette: this.palette,
      blocks: this.blocks,
      subChunkVersion: this.subChunkVersion,
      hash: this.hash,
      updated: this.updated,

      blockLight: this.blockLight,
      skyLight: this.skyLight
    }
  }
}

module.exports = SubChunk
