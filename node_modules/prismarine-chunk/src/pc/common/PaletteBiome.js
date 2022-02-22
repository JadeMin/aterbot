const constants = require('./constants')
const paletteContainer = require('./PaletteContainer')
const varInt = require('../common/varInt')
const SingleValueContainer = paletteContainer.SingleValueContainer
const IndirectPaletteContainer = paletteContainer.IndirectPaletteContainer
const DirectPaletteContainer = paletteContainer.DirectPaletteContainer

function getBiomeIndex (pos) {
  return (pos.y << 4) | (pos.z << 2) | pos.x
}

class BiomeSection {
  constructor (options) {
    this.data = options?.data ?? new SingleValueContainer({
      value: options?.singleValue ?? 0,
      bitsPerValue: constants.MIN_BITS_PER_BIOME,
      capacity: constants.BIOME_SECTION_VOLUME,
      maxBits: constants.MAX_BITS_PER_BIOME
    })
  }

  toJson () {
    return this.data.toJson()
  }

  static fromJson (j) {
    return new BiomeSection({
      data: paletteContainer.fromJson(j)
    })
  }

  get (pos) {
    return this.data.get(getBiomeIndex(pos))
  }

  set (pos, biomeId) {
    this.data = this.data.set(getBiomeIndex(pos), biomeId)
  }

  static fromLocalPalette ({ palette, data }) {
    return new BiomeSection({
      data: palette.length === 1
        ? new SingleValueContainer({
          value: palette[0],
          bitsPerValue: constants.MIN_BITS_PER_BIOME,
          capacity: constants.BIOME_SECTION_VOLUME,
          maxBits: constants.MAX_BITS_PER_BIOME
        })
        : new IndirectPaletteContainer({
          palette,
          data
        })
    })
  }

  write (smartBuffer) {
    this.data.write(smartBuffer)
  }

  static read (smartBuffer) {
    const bitsPerBlock = smartBuffer.readUInt8()
    if (!bitsPerBlock) {
      const section = new BiomeSection({
        singleValue: varInt.read(smartBuffer)
      })
      smartBuffer.readUInt8()
      return section
    }

    if (bitsPerBlock > constants.MAX_BITS_PER_BIOME) {
      varInt.read(smartBuffer)
      return new BiomeSection({
        data: new DirectPaletteContainer({
          bitsPerValue: bitsPerBlock,
          capacity: constants.BIOME_SECTION_VOLUME
        }).readBuffer(smartBuffer)
      })
    }

    const palette = []
    const paletteLength = varInt.read(smartBuffer)
    for (let i = 0; i < paletteLength; ++i) {
      palette.push(varInt.read(smartBuffer))
    }

    varInt.read(smartBuffer)
    return new BiomeSection({
      data: new IndirectPaletteContainer({
        bitsPerValue: bitsPerBlock,
        capacity: constants.BIOME_SECTION_VOLUME,
        maxBits: constants.MAX_BITS_PER_BIOME,
        palette
      }).readBuffer(smartBuffer)
    })
  }
}

module.exports = BiomeSection
