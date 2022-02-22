const BitArray = require('./BitArrayNoSpan')
const constants = require('./constants')
const neededBits = require('./neededBits')
const varInt = require('./varInt')

class DirectPaletteContainer {
  constructor (options) {
    this.data = new BitArray({
      bitsPerValue: options?.bitsPerValue ?? constants.GLOBAL_BITS_PER_BLOCK,
      capacity: options?.capacity ?? constants.BLOCK_SECTION_VOLUME
    })
  }

  get (index) {
    return this.data.get(index)
  }

  set (index, value) {
    this.data.set(index, value)
    return this
  }

  write (smartBuffer) {
    smartBuffer.writeUInt8(this.data.bitsPerValue)
    varInt.write(smartBuffer, this.data.length())
    this.data.writeBuffer(smartBuffer)
  }

  readBuffer (smartBuffer) {
    this.data.readBuffer(smartBuffer)
    return this
  }

  toJson () {
    return JSON.stringify({
      type: 'direct',
      data: this.data.toJson()
    })
  }

  static fromJson (j) {
    const parsed = JSON.parse(j)
    return new DirectPaletteContainer({
      data: BitArray.fromJson(parsed.data)
    })
  }
}

class IndirectPaletteContainer {
  constructor (options) {
    this.data = options?.data ?? new BitArray({
      bitsPerValue: options?.bitsPerValue ?? constants.MIN_BITS_PER_BLOCK,
      capacity: options?.capacity ?? constants.BLOCK_SECTION_VOLUME
    })

    this.palette = options?.palette ?? [0]
    this.maxBits = options?.maxBits ?? constants.MAX_BITS_PER_BLOCK
  }

  get (index) {
    return this.palette[this.data.get(index)]
  }

  set (index, value) {
    let paletteIndex = this.palette.indexOf(value)
    if (paletteIndex < 0) {
      paletteIndex = this.palette.length
      this.palette.push(value)
      const bitsPerValue = neededBits(paletteIndex)
      if (bitsPerValue > this.data.bitsPerValue) {
        if (bitsPerValue <= this.maxBits) {
          this.data = this.data.resizeTo(bitsPerValue)
        } else {
          return this.convertToDirect().set(index, value)
        }
      }
    }
    this.data.set(index, paletteIndex)
    return this
  }

  convertToDirect (bitsPerValue) {
    const direct = new DirectPaletteContainer({
      bitsPerValue: bitsPerValue ?? constants.GLOBAL_BITS_PER_BLOCK,
      capacity: this.data.capacity
    })
    for (let i = 0; i < this.data.capacity; ++i) {
      direct.data.set(i, this.get(i))
    }
    return direct
  }

  write (smartBuffer) {
    smartBuffer.writeUInt8(this.data.bitsPerValue)
    varInt.write(smartBuffer, this.palette.length)
    for (const paletteElement of this.palette) {
      varInt.write(smartBuffer, paletteElement)
    }
    varInt.write(smartBuffer, this.data.length())
    this.data.writeBuffer(smartBuffer)
  }

  readBuffer (smartBuffer) {
    this.data.readBuffer(smartBuffer)
    return this
  }

  toJson () {
    return JSON.stringify({
      type: 'indirect',
      palette: this.palette,
      maxBits: this.maxBits,
      data: this.data.toJson()
    })
  }

  static fromJson (j) {
    const parsed = JSON.parse(j)
    return new IndirectPaletteContainer({
      palette: parsed.palette,
      maxBits: parsed.maxBits,
      data: BitArray.fromJson(parsed.data)
    })
  }
}

class SingleValueContainer {
  constructor (options) {
    this.value = options?.value ?? 0
    this.bitsPerValue = options?.bitsPerValue ?? constants.MIN_BITS_PER_BLOCK
    this.capacity = options?.capacity ?? constants.BLOCK_SECTION_VOLUME
    this.maxBits = options?.maxBits ?? constants.MAX_BITS_PER_BLOCK
  }

  get (index) {
    return this.value
  }

  set (index, value) {
    if (value === this.value) { return this }

    const data = new BitArray({
      bitsPerValue: this.bitsPerValue,
      capacity: this.capacity
    })
    data.set(index, 1)

    return new IndirectPaletteContainer({
      data,
      palette: [this.value, value],
      capacity: this.capacity,
      bitsPerValue: this.bitsPerValue,
      maxBits: this.maxBits
    })
  }

  write (smartBuffer) {
    smartBuffer.writeUInt8(0)
    varInt.write(smartBuffer, this.value)
    smartBuffer.writeUInt8(0)
  }

  toJson () {
    return JSON.stringify({
      type: 'single',
      value: this.value,
      bitsPerValue: this.bitsPerValue,
      capacity: this.capacity,
      maxBits: this.maxBits
    })
  }

  static fromJson (j) {
    const parsed = JSON.parse(j)
    return new SingleValueContainer({
      value: parsed.value,
      bitsPerValue: parsed.bitsPerValue,
      capacity: parsed.capacity,
      maxBits: parsed.maxBits
    })
  }
}

function containerFromJson (j) {
  const parsed = JSON.parse(j)
  if (parsed.type === 'direct') {
    return new DirectPaletteContainer({
      data: BitArray.fromJson(parsed.data)
    })
  } else if (parsed.type === 'indirect') {
    return new IndirectPaletteContainer({
      palette: parsed.palette,
      maxBits: parsed.maxBits,
      data: BitArray.fromJson(parsed.data)
    })
  } else if (parsed.type === 'single') {
    return new SingleValueContainer({
      value: parsed.value,
      bitsPerValue: parsed.bitsPerValue,
      capacity: parsed.capacity,
      maxBits: parsed.maxBits
    })
  }
  return undefined
}

module.exports = {
  SingleValueContainer,
  IndirectPaletteContainer,
  DirectPaletteContainer,
  fromJson: containerFromJson
}
