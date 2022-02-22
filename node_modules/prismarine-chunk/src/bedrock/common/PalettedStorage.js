const wordByteSize = 4
const wordBitSize = wordByteSize * 8

class BetterUint32Array extends Uint32Array {
  toJSON () {
    return Array.from(this)
  }

  [Symbol.for('nodejs.util.inspect.custom')] () {
    return `[Uint32Array of ${this.length} items { ${this.slice(0, 10).toString()} ${this.length > 10 ? ', ...' : ''} }]`
  }
}

class PalettedStorage {
  constructor (bitsPerBlock) {
    this.bitsPerBlock = bitsPerBlock
    this.blocksPerWord = Math.floor(wordBitSize / bitsPerBlock)
    this.wordsCount = Math.ceil(4096 / this.blocksPerWord)
    this.mask = ((1 << bitsPerBlock) - 1)
    this.array = new BetterUint32Array(this.wordsCount)
  }

  read (stream) {
    const buf = stream.readBuffer(this.wordsCount * wordByteSize)
    this.array = new BetterUint32Array(new Uint8Array(buf).buffer)
  }

  write (stream) {
    stream.writeBuffer(Buffer.from(this.array.buffer))
  }

  static copyFrom (other) {
    const next = new PalettedStorage(other.bitsPerBlock)
    Object.assign(next, other)
    if (other instanceof Uint32Array) {
      next.array = new BetterUint32Array(other.array.slice())
    } else {
      next.array = new BetterUint32Array(other.array)
    }
    return next
  }

  getBuffer () {
    return Buffer.from(this.array.buffer)
  }

  readBits (index, offset) {
    return (this.array[index] >> offset) & this.mask
  }

  writeBits (index, offset, data) {
    this.array[index] &= ~(this.mask << offset)
    this.array[index] |= (data & this.mask) << offset
  }

  getIndex (x, y, z) {
    x &= 0xf
    y &= 0xf
    z &= 0xf
    const index = Math.floor(((x << 8) | (z << 4) | y) / this.blocksPerWord)
    const offset = (((x << 8) | (z << 4) | y) % this.blocksPerWord) * this.bitsPerBlock
    return [index, offset]
  }

  get (x, y, z) {
    const [index, offset] = this.getIndex(x, y, z)
    return this.readBits(index, offset)
  }

  set (x, y, z, data) {
    const [index, offset] = this.getIndex(x, y, z)
    this.writeBits(index, offset, data)
  }

  resize (newBitsPerBlock) {
    const storage = new PalettedStorage(newBitsPerBlock)
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        for (let z = 0; z < 16; z++) {
          storage.set(x, y, z, this.get(x, y, z))
        }
      }
    }
    return storage
  }

  forEach (callback) {
    for (let i = 0; i < this.wordsCount; i++) {
      for (let j = 0; j < this.blocksPerWord; j++) {
        callback(this.readBits(i, j * this.bitsPerBlock))
      }
    }
  }

  incrementPalette (palette) {
    for (let i = 0; i < this.wordsCount; i++) {
      for (let j = 0; j < this.blocksPerWord; j++) {
        const ix = this.readBits(i, j * this.bitsPerBlock)
        palette[ix].count++
      }
    }
  }
}

module.exports = PalettedStorage
