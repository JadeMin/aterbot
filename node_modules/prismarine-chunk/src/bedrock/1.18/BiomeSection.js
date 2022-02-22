const { StorageType } = require('../common/constants')
const PalettedStorage = require('../common/PalettedStorage')
const neededBits = require('../../pc/common/neededBits')

class BiomeSection {
  constructor (registry, y, options = {}) {
    this.Biome = require('prismarine-biome')(registry)
    this.y = y
    this.biomes = options.biomes ? PalettedStorage.copyFrom(options.biomes) : new PalettedStorage(1)
    this.palette = options.palette || [0]
  }

  readLegacy2D (stream) {
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        this.setBiomeId(x, 0, z, stream.readByte())
      }
    }
  }

  copy (other) {
    this.biomes = PalettedStorage.copyFrom(other.biomes)
    this.palette = JSON.parse(JSON.stringify(other.palette))
    this.y = other.y
  }

  read (type, buf, previousSection) {
    this.palette = []
    const paletteType = buf.readByte()
    // below should always be 1, so we use numerical IDs
    const usingNetworkRuntimeIds = paletteType & 1
    if (usingNetworkRuntimeIds !== 1) throw new Error('Biome palette type must be set to use runtime IDs')
    const bitsPerBlock = paletteType >> 1

    if (bitsPerBlock === 0) {
      this.palette.push(type === StorageType.LocalPersistence ? buf.readInt32LE() : (buf.readVarInt() >> 1))
      return // short circuit
    }

    this.biomes = new PalettedStorage(bitsPerBlock)
    this.biomes.read(buf)

    // now read palette
    if (type === StorageType.Runtime) {
      // Shift 1 bit to un-zigzag (we cannot be negative)
      const biomePaletteLength = buf.readVarInt() >> 1
      for (let i = 0; i < biomePaletteLength; i++) {
        this.palette.push(buf.readVarInt() >> 1)
      }
    } else {
      const biomePaletteLength = buf.readInt32LE()
      for (let i = 0; i < biomePaletteLength; i++) {
        this.palette.push(buf.readInt32LE())
      }
    }
  }

  // TODO: handle downsizing
  setBiomeId (x, y, z, biomeId) {
    if (!this.palette.includes(biomeId)) {
      this.palette.push(biomeId)
    }

    const minBits = neededBits(this.palette.length - 1)
    if (minBits > this.biomes.bitsPerBlock) {
      this.biomes = this.biomes.resize(minBits)
    }

    this.biomes.set(x, y, z, this.palette.indexOf(biomeId))
  }

  getBiomeId (x, y, z) {
    return this.palette[this.biomes.get(x, y, z)]
  }

  getBiome (pos) {
    return new this.Biome(this.getBiomeId(pos.x, pos.y, pos.z))
  }

  setBiome (pos, biome) {
    this.setBiomeId(pos.x, pos.y, pos.z, biome.id)
  }

  export (type, stream) {
    const bitsPerBlock = Math.ceil(Math.log2(this.palette.length))
    const paletteType = (bitsPerBlock << 1) | (type === StorageType.Runtime)
    stream.writeUInt8(paletteType)
    if (bitsPerBlock === 0) {
      if (type === StorageType.LocalPersistence) {
        stream.writeInt32LE(this.palette[0])
      } else {
        stream.writeVarInt(this.palette[0] << 1)
      }
      return // short circuit
    }

    this.biomes.write(stream)
    if (type === StorageType.Runtime) {
      stream.writeVarInt(this.palette.length << 1)
      for (const biome of this.palette) {
        stream.writeVarInt(biome << 1)
      }
    } else {
      stream.writeUInt32LE(this.palette.length)
      for (const biome of this.palette) {
        stream.writeUInt32LE(biome)
      }
    }
  }

  // Just write the top most layer biomes
  exportLegacy2D (stream) {
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        const y = 0
        const biome = this.getBiomeId(x, y, z)
        stream.writeUInt8(biome)
      }
    }
  }

  toObject () {
    return {
      y: this.y,
      biomes: this.biomes,
      palette: this.palette
    }
  }
}

module.exports = BiomeSection
