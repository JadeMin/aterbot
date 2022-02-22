const CommonChunkColumn = require('../common/CommonChunkColumn')
const SubChunk = require('./SubChunk')
const BiomeSection = require('../1.18/BiomeSection')
const { StorageType } = require('../common/constants')
const Stream = require('../common/Stream')
const { BlobType, BlobEntry } = require('../common/BlobCache')
const nbt = require('prismarine-nbt')
const { getChecksum } = require('../common/util')

class ChunkColumn13 extends CommonChunkColumn {
  Section = SubChunk

  constructor (options = {}, registry, Block) {
    super(options, registry)
    this.Block = Block
    this.biomes = []
    this.sections = []
    this.biomesUpdated = true
    if (options.sections?.length) {
      for (const section of options.sections) {
        if (section) {
          this.sections.push(new this.Section(registry, Block, section))
        } else {
          this.sections.push(null)
        }
      }
    }

    if (options.biomes?.length) {
      for (const biome of options.biomes) {
        this.biomes.push(biome ? new BiomeSection(registry, biome.y, biome) : null)
      }
    } else {
      this.biomes.push(new BiomeSection(registry, 0))
    }
  }

  getBiome (pos) {
    return new this.Biome(this.biomes[0].getBiomeId(pos.x, 0, pos.z))
  }

  setBiome (pos, biome) {
    this.biomes[0].setBiomeId(pos.x, 0, pos.z, biome.id)
    this.biomesUpdated = true
  }

  getBiomeId (pos) {
    return this.biomes[0].getBiomeId(pos.x, 0, pos.z)
  }

  setBiomeId (pos, biome) {
    this.biomes[0].setBiomeId(pos.x, 0, pos.z, biome)
    this.biomesUpdated = true
  }

  loadLegacyBiomes (buf) {
    if (buf instanceof Buffer) buf = new Stream(buf)
    const biome = new BiomeSection(this.registry, 0)
    biome.readLegacy2D(buf)
    this.biomes = [biome]
  }

  // Load heightmap data
  /** @type Uint16Array */
  loadHeights (heightmap) {
    this.heights = heightmap
  }

  getHeights () {
    return this.heights
  }

  writeLegacyBiomes (stream) {
    this.biomes[0].exportLegacy2D(stream)
  }

  writeHeightMap (stream) {
    if (!this.heights) {
      this.heights = new Uint16Array(256)
    }
    for (let i = 0; i < 256; i++) {
      stream.writeUInt16LE(this.heights[i])
    }
  }

  async updateBiomeHash (fromBuf) {
    this.biomesUpdated = false
    this.biomesHash = await getChecksum(fromBuf)
    return this.biomesHash
  }

  /**
   * Encodes this chunk column for the network with no caching
   * @param buffer Full chunk buffer
   */
  async networkEncodeNoCache () {
    const tileBufs = []
    for (const key in this.blockEntities) {
      const tile = this.blockEntities[key]
      tileBufs.push(nbt.writeUncompressed(tile, 'littleVarint'))
    }

    let biomeBuf
    const stream = new Stream(Buffer.alloc(256))
    if (this.biomes[0]) {
      this.biomes[0].exportLegacy2D(stream)
      biomeBuf = stream.buffer
    } else {
      throw Error('No biome section')
    }

    const sectionBufs = []
    for (const section of this.sections) {
      sectionBufs.push(await section.encode(StorageType.Runtime, false, this.compactOnSave))
    }
    return Buffer.concat([
      ...sectionBufs,
      biomeBuf,
      Buffer.from([0]), // border blocks count
      ...tileBufs // block entities
    ])
  }

  /**
   * Encodes this chunk column for use over network with caching enabled
   *
   * @param blobStore The blob store to write chunks in this section to
   * @returns {Promise<Buffer[]>} The blob hashes for this chunk, the last one is biomes, rest are sections
   */
  async networkEncodeBlobs (blobStore) {
    const blobHashes = []
    for (const section of this.sections) {
      if (section.updated || !blobStore.get(section.hash)) {
        const buffer = await section.encode(StorageType.NetworkPersistence, true, this.compactOnSave)
        const blob = new BlobEntry({ x: this.x, y: section.y, z: this.z, type: BlobType.ChunkSection, buffer })
        blobStore.set(section.hash, blob)
      }
      blobHashes.push({ hash: section.hash, type: BlobType.ChunkSection })
    }
    if (this.biomesUpdated || !this.biomesHash || !blobStore.get(this.biomesHash)) {
      if (this.biomes[0]) {
        const stream = new Stream()
        this.biomes[0].exportLegacy2D(stream)
        await this.updateBiomeHash(stream.getBuffer())
      } else {
        await this.updateBiomeHash(Buffer.alloc(256))
      }

      this.biomesUpdated = false
      blobStore.set(this.biomesHash, new BlobEntry({ x: this.x, z: this.z, type: BlobType.Biomes, buffer: this.biomes }))
    }
    blobHashes.push({ hash: this.biomesHash, type: BlobType.Biomes })
    return blobHashes
  }

  async networkEncode (blobStore) {
    const blobs = await this.networkEncodeBlobs(blobStore)
    const tileBufs = []
    for (const key in this.blockEntities) {
      const tile = this.blockEntities[key]
      tileBufs.push(nbt.writeUncompressed(tile, 'littleVarint'))
    }

    return {
      blobs, // cache blobs
      payload: Buffer.concat([ // non-cached stuff
        Buffer.from([0]), // border blocks
        ...tileBufs
      ])
    }
  }

  async networkDecodeNoCache (buffer, sectionCount) {
    const stream = new Stream(buffer)

    if (sectionCount === -1) { // In 1.18+, with sectionCount as -1 we only get the biomes here
      throw new RangeError('-1 section count not supported below 1.18')
    }

    this.sections = []
    for (let i = 0; i < sectionCount; i++) {
      // in 1.17.30+, chunk index is sent in payload
      const section = new SubChunk(this.registry, this.Block, { y: i, subChunkVersion: this.subChunkVersion })
      section.decode(StorageType.Runtime, stream)
      this.setSection(i, section)
    }

    const biomes = new BiomeSection(this.registry, 0)
    biomes.readLegacy2D(stream)
    this.biomes = [biomes]

    const borderBlocksLength = stream.readZigZagVarInt()
    const borderBlocks = stream.readBuffer(borderBlocksLength)
    // Don't know how to handle this yet
    if (borderBlocks.length) throw Error(`Read ${borderBlocksLength} border blocks, expected 0`)

    let startOffset = stream.readOffset
    while (stream.peek() === 0x0A) {
      const { data, metadata } = nbt.protos.littleVarint.parsePacketBuffer('nbt', buffer, startOffset)
      stream.readOffset += metadata.size
      startOffset += metadata.size
      this.addBlockEntity(data)
    }
  }

  /**
   * Decodes cached chunks sent over the network
   * @param blobs The blob hashes sent in the Chunk packet
   * @param blobStore Our blob store for cached data
   * @param {Buffer} payload The rest of the non-cached data
   * @returns {CCHash[]} A list of hashes we don't have and need. If len > 0, decode failed.
   */
  async networkDecode (blobs, blobStore, payload) {
    // We modify blobs, need to make a copy here
    blobs = [...blobs]
    if (!blobs.length) {
      throw new Error('No blobs to decode')
    }

    if (payload) {
      const stream = new Stream(payload)
      const borderblocks = stream.readBuffer(stream.readByte())
      if (borderblocks.length) {
        throw new Error('cannot handle border blocks (read length: ' + borderblocks.length + ')')
      }

      let startOffset = stream.readOffset
      while (stream.peek() === 0x0A) {
        const { metadata, data } = nbt.protos.littleVarint.parsePacketBuffer('nbt', payload, startOffset)
        stream.readOffset += metadata.size
        startOffset += metadata.size
        this.addBlockEntity(data)
      }
    }

    const misses = []
    for (const blob of blobs) {
      if (!blobStore.has(blob)) {
        misses.push(blob)
      }
    }
    if (misses.length > 0) {
      // missing things, call this again once the server replies with our MISSing
      // blobs and don't try to load this column until we have all the data
      return misses
    }

    // Reset the sections & length, when we add a section, it will auto increment
    this.sections = []
    this.sectionsLen = 0
    const biomeBlob = blobs.pop()

    for (let i = 0; i < blobs.length; i++) {
      const blob = blobStore.get(blobs[i])
      const section = new SubChunk(this.registry, this.Block, { y: i, subChunkVersion: this.subChunkVersion })
      section.decode(StorageType.NetworkPersistence, blob.buffer)
      this.setSection(i, section)
    }

    const biomeEntry = blobStore.get(biomeBlob)
    this.loadLegacyBiomes(biomeEntry.buffer)

    return misses // should be empty
  }

  toObject () {
    const biomes = this.biomes.map(b => b?.toObject())
    return { ...super.toObject(), biomes, biomesUpdated: this.biomesUpdated, version: this.registry.version.minecraftVersion }
  }

  toJson () {
    return JSON.stringify(this.toObject())
  }
}

module.exports = ChunkColumn13
