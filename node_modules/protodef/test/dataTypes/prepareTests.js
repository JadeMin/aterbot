const ProtoDef = require('protodef').ProtoDef
const { ProtoDefCompiler } = require('protodef').Compiler

const proto = new ProtoDef()
const compiler = new ProtoDefCompiler()

const testData = [
  {
    kind: 'conditional',
    data: require('../../ProtoDef/test/conditional.json')
  },
  {
    kind: 'numeric',
    data: require('../../ProtoDef/test/numeric.json')
  },
  {
    kind: 'structures',
    data: require('../../ProtoDef/test/structures.json')
  },
  {
    kind: 'utils',
    data: require('../../ProtoDef/test/utils.json')
  }
]

function arrayToBuffer (arr) {
  return Buffer.from(arr.map(e => parseInt(e)))
}

function transformValues (type, values) {
  return values.map(val => {
    let value = val.value
    if (type.indexOf('buffer') === 0) {
      value = arrayToBuffer(value)
    } else if (value) {
      // we cannot use undefined type in JSON so need to convert it here to pass strictEquals test
      for (const key in value) {
        if (value[key] === 'undefined') value[key] = undefined
      }
    }
    return {
      buffer: arrayToBuffer(val.buffer),
      value,
      description: val.description
    }
  })
}

testData.forEach(tests => {
  tests.originalData = JSON.parse(JSON.stringify(tests.data))
  tests.data.forEach(test => {
    const subTypes = []
    if (test.subtypes) {
      test.subtypes.forEach((subtype, i) => {
        const type = test.type + '_' + i
        proto.addType(type, subtype.type)
        const types = {}
        types[type] = subtype.type
        compiler.addTypesToCompile(types)

        subtype.vars?.forEach(([k, v]) => { proto.setVariable(k, v); compiler.addVariable(k, v) })
        subtype.values = transformValues(test.type, subtype.values)
        subtype.type = type
        subTypes.push(subtype)
      })
    } else {
      test.values = transformValues(test.type, test.values)
      subTypes.push({ type: test.type, values: test.values })
    }
    test.subtypes = subTypes
  })
})

module.exports = {
  testData,
  proto,
  compiledProto: compiler.compileProtoDefSync()
}
