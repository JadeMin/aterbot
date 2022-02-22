const { ProtoDef } = require('protodef')
const assert = require('assert')

// Create a protocol where DrawText is sent with a "opacity" field at the end only if the color isn't transparent.
const protocol = {
  string: ['pstring', { countType: 'varint' }],
  ColorPalette: ['container', [{ name: 'palette', type: ['array', { countType: 'i32', type: 'string' }] }]],
  DrawText: ['container', [{ name: 'color', type: 'u8' }, { name: 'opacity', type: ['switch', { compareTo: 'color', fields: { '/color_transparent': 'void' }, default: 'u8' }] }]]
}

function test () {
  // A "palette" here refers to a array of values, identified with their index in the array
  const palette = ['red', 'green', 'blue', 'transparent']
  const proto = new ProtoDef()
  proto.addTypes(protocol)
  // A "variable" is similar to a type, it's a primitive value that can be used in switch comparisons.
  proto.setVariable('color_transparent', palette.indexOf('transparent'))
  // An example usage is sending paletted IDs, with feild serialization based on those IDs
  proto.createPacketBuffer('ColorPalette', { palette })
  // Here, "opacity", 0x4 is written *only* if the color isn't transparent. In this case, it is, so 0x4 isn't written.
  // At the top is 0x3, the index of the "transparent" color.
  const s = proto.createPacketBuffer('DrawText', { color: palette.indexOf('transparent'), opacity: 4 })
  assert(s.equals(Buffer.from([3])))
  console.log(s)

  // Here 4 should be written at the end
  const t = proto.createPacketBuffer('DrawText', { color: palette.indexOf('blue'), opacity: 4 })
  assert(t.equals(Buffer.from([2, 4])))
}

test()
