// const assert = require('assert')
const neededBits = require('./neededBits')

class BitArray {
  constructor (options) {
    if (options === null) {
      return
    }
    // assert(options.bitsPerValue > 0, 'bits per value must at least 1')
    // assert(options.bitsPerValue <= 32, 'bits per value exceeds 32')

    const valuesPerLong = Math.floor(64 / options.bitsPerValue)
    const bufferSize = Math.ceil(options.capacity / valuesPerLong) * 2
    const valueMask = (1 << options.bitsPerValue) - 1

    this.data = new Uint32Array(options?.data ?? bufferSize)
    this.capacity = options.capacity
    this.bitsPerValue = options.bitsPerValue
    this.valuesPerLong = valuesPerLong
    this.valueMask = valueMask
  }

  toJson () {
    return JSON.stringify({
      data: Array.from(this.data),
      capacity: this.capacity,
      bitsPerValue: this.bitsPerValue,
      valuesPerLong: this.valuesPerLong,
      valueMask: this.valueMask
    })
  }

  static fromJson (j) {
    return new BitArray(JSON.parse(j))
  }

  toArray () {
    const array = []
    for (let i = 0; i < this.capacity; i++) {
      array.push(this.get(i))
    }
    return array
  }

  static fromArray (array, bitsPerValue) {
    const bitarray = new BitArray({
      capacity: array.length,
      bitsPerValue
    })
    for (let i = 0; i < array.length; i++) {
      bitarray.set(i, array[i])
    }
    return bitarray
  }

  // [[MSB, LSB]]
  toLongArray () {
    const array = []
    for (let i = 0; i < this.data.length; i += 2) {
      array.push([this.data[i + 1] << 32 >> 32, this.data[i] << 32 >> 32])
    }
    return array
  }

  static fromLongArray (array, bitsPerValue) {
    const bitArray = new BitArray({
      capacity: Math.floor(64 / bitsPerValue) * array.length,
      bitsPerValue
    })
    for (let i = 0; i < array.length; i++) {
      const j = i * 2
      bitArray.data[j + 1] = array[i][0]
      bitArray.data[j] = array[i][1]
    }
    return bitArray
  }

  static or (a, b) {
    const long = a.data.length > b.data.length ? a.data : b.data
    const short = a.data.length > b.data.length ? b.data : a.data
    const array = new Uint32Array(long.length)
    array.set(long)
    for (let i = 0; i < short.length; i++) {
      array[i] |= short[i]
    }
    return new BitArray({
      data: array.buffer,
      bitsPerValue: Math.max(a.bitsPerValue, b.bitsPerValue)
    })
  }

  get (index) {
    // assert(index >= 0 && index < this.capacity, 'index is out of bounds')

    const startLongIndex = Math.floor(index / this.valuesPerLong)
    const indexInLong = (index - startLongIndex * this.valuesPerLong) * this.bitsPerValue
    if (indexInLong >= 32) {
      const indexInStartLong = indexInLong - 32
      const startLong = this.data[startLongIndex * 2 + 1]
      return (startLong >>> indexInStartLong) & this.valueMask
    }
    const startLong = this.data[startLongIndex * 2]
    const indexInStartLong = indexInLong
    let result = startLong >>> indexInStartLong
    const endBitOffset = indexInStartLong + this.bitsPerValue
    if (endBitOffset > 32) {
      // Value stretches across multiple longs
      const endLong = this.data[startLongIndex * 2 + 1]
      result |= endLong << (32 - indexInStartLong)
    }
    return result & this.valueMask
  }

  set (index, value) {
    // assert(index >= 0 && index < this.capacity, 'index is out of bounds')
    // assert(value <= this.valueMask, 'value does not fit into bits per value')

    const startLongIndex = Math.floor(index / this.valuesPerLong)
    const indexInLong = (index - startLongIndex * this.valuesPerLong) * this.bitsPerValue
    if (indexInLong >= 32) {
      const indexInStartLong = indexInLong - 32
      this.data[startLongIndex * 2 + 1] =
      ((this.data[startLongIndex * 2 + 1] & ~(this.valueMask << indexInStartLong)) |
      ((value & this.valueMask) << indexInStartLong)) >>> 0
      return
    }
    const indexInStartLong = indexInLong

    // Clear bits of this value first
    this.data[startLongIndex * 2] =
      ((this.data[startLongIndex * 2] & ~(this.valueMask << indexInStartLong)) |
      ((value & this.valueMask) << indexInStartLong)) >>> 0
    const endBitOffset = indexInStartLong + this.bitsPerValue
    if (endBitOffset > 32) {
      // Value stretches across multiple longs
      this.data[startLongIndex * 2 + 1] =
        ((this.data[startLongIndex * 2 + 1] &
          ~((1 << (endBitOffset - 32)) - 1)) |
        (value >> (32 - indexInStartLong))) >>> 0
    }
  }

  resize (newCapacity) {
    const newArr = new BitArray({
      bitsPerValue: this.bitsPerValue,
      capacity: newCapacity
    })
    for (let i = 0; i < Math.min(newCapacity, this.capacity); ++i) {
      newArr.set(i, this.get(i))
    }

    return newArr
  }

  resizeTo (newBitsPerValue) {
    // assert(newBitsPerValue > 0, 'bits per value must at least 1')
    // assert(newBitsPerValue <= 32, 'bits per value exceeds 32')

    const newArr = new BitArray({
      bitsPerValue: newBitsPerValue,
      capacity: this.capacity
    })
    for (let i = 0; i < this.capacity; ++i) {
      const value = this.get(i)
      if (neededBits(value) > newBitsPerValue) {
        throw new Error(
          "existing value in BitArray can't fit in new bits per value"
        )
      }
      newArr.set(i, value)
    }

    return newArr
  }

  length () {
    return this.data.length / 2
  }

  readBuffer (smartBuffer) {
    for (let i = 0; i < this.data.length; i += 2) {
      this.data[i + 1] = smartBuffer.readUInt32BE()
      this.data[i] = smartBuffer.readUInt32BE()
    }
    return this
  }

  writeBuffer (smartBuffer) {
    for (let i = 0; i < this.data.length; i += 2) {
      smartBuffer.writeUInt32BE(this.data[i + 1])
      smartBuffer.writeUInt32BE(this.data[i])
    }
    return this
  }

  getBitsPerValue () {
    return this.bitsPerValue
  }
}

module.exports = BitArray
