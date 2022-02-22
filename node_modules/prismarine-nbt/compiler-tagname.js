/* global ctx */
function readPString (buffer, offset) {
  const { value, size } = ctx.shortString(buffer, offset)
  for (const c of value) {
    if (c === '\0') throw new Error('unexpected tag end')
  }
  return { value, size }
}

function writePString (...args) {
  return ctx.shortString(...args)
}

function sizeOfPString (...args) {
  return ctx.shortString(...args)
}

module.exports = {
  Read: { nbtTagName: ['context', readPString] },
  Write: { nbtTagName: ['context', writePString] },
  SizeOf: { nbtTagName: ['context', sizeOfPString] }
}
