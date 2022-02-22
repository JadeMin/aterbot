/**
 * Reads the length for a VarInt
 */
function sizeOfVarInt (value) {
  value = (value << 1) ^ (value >> 63)
  let cursor = 0
  while (value & ~0x7F) {
    value >>>= 7
    cursor++
  }
  return cursor + 1
}

function sizeOfVarLong (value) {
  if (typeof value.valueOf() === 'object') {
    value = (BigInt(value[0]) << 32n) | BigInt(value[1])
  } else if (typeof value !== 'bigint') value = BigInt(value)

  value = (value << 1n) ^ (value >> 63n)
  let cursor = 0
  while (value > 127n) {
    value >>= 7n
    cursor++
  }
  return cursor + 1
}

/**
 * Reads a zigzag encoded 64-bit VarInt as a BigInt
 */
function readSignedVarLong (buffer, offset) {
  let result = BigInt(0)
  let shift = 0n
  let cursor = offset
  let size = 0

  while (true) {
    if (cursor + 1 > buffer.length) { throw new Error('unexpected buffer end') }
    const b = buffer.readUInt8(cursor)
    result |= (BigInt(b) & 0x7fn) << shift // Add the bits to our number, except MSB
    cursor++
    if (!(b & 0x80)) { // If the MSB is not set, we return the number
      size = cursor - offset
      break
    }
    shift += 7n // we only have 7 bits, MSB being the return-trigger
    if (shift > 63n) throw new Error(`varint is too big: ${shift}`)
  }

  // in zigzag encoding, the sign bit is the LSB of the value - remove the bit,
  // if 1, then flip the rest of the bits (xor) and set to negative
  // Note: bigint has no sign bit; instead if we XOR -0 we get no-op, XOR -1 flips and sets negative
  const zigzag = (result >> 1n) ^ -(result & 1n)
  return { value: zigzag, size }
}

/**
 * Writes a zigzag encoded 64-bit VarInt as a BigInt
 */
function writeSignedVarLong (value, buffer, offset) {
  // if an array, turn it into a BigInt
  if (typeof value.valueOf() === 'object') {
    value = BigInt.asIntN(64, (BigInt(value[0]) << 32n)) | BigInt(value[1])
  } else if (typeof value !== 'bigint') value = BigInt(value)

  // shift value left and flip if negative (no sign bit, but right shifting beyond value will always be -0b1)
  value = (value << 1n) ^ (value >> 63n)
  let cursor = 0
  while (value > 127n) { // keep writing in 7 bit slices
    const num = Number(value & 0xFFn)
    buffer.writeUInt8(num | 0x80, offset + cursor)
    cursor++
    value >>= 7n
  }
  buffer.writeUInt8(Number(value), offset + cursor)
  return offset + cursor + 1
}

/**
 * Reads a 32-bit zigzag encoded varint as a Number
 */
function readSignedVarInt (buffer, offset) {
  let result = 0
  let shift = 0
  let cursor = offset
  let size = 0

  while (true) {
    if (cursor + 1 > buffer.length) { throw new Error('unexpected buffer end') }
    const b = buffer.readUInt8(cursor)
    result |= ((b & 0x7f) << shift) // Add the bits to our number, except MSB
    cursor++
    if (!(b & 0x80)) { // If the MSB is not set, we return the number
      size = cursor - offset
      break
    }
    shift += 7 // we only have 7 bits, MSB being the return-trigger
    if (shift > 31) throw new Error(`varint is too big: ${shift}`)
  }

  const zigzag = ((((result << 63) >> 63) ^ result) >> 1) ^ (result & (1 << 63))
  return { value: zigzag, size }
}

/**
 * Writes a 32-bit zigzag encoded varint
 */
function writeSignedVarInt (value, buffer, offset) {
  value = (value << 1) ^ (value >> 31)
  let cursor = 0
  while (value & ~0x7F) {
    const num = Number((value & 0xFF) | 0x80)
    buffer.writeUInt8(num, offset + cursor)
    cursor++
    value >>>= 7
  }
  buffer.writeUInt8(value, offset + cursor)
  return offset + cursor + 1
}

module.exports = {
  Read: { zigzag64: ['native', readSignedVarLong], zigzag32: ['native', readSignedVarInt] },
  Write: { zigzag64: ['native', writeSignedVarLong], zigzag32: ['native', writeSignedVarInt] },
  SizeOf: { zigzag64: ['native', sizeOfVarLong], zigzag32: ['native', sizeOfVarInt] }
}
