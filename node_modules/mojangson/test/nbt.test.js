/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')
const mojangson = require('../')
const nbt = require('prismarine-nbt')

const tests = ['test001']

describe('nbt', function () {
  const data = []
  for (const test of tests) {
    const text = fs.readFileSync(`test/${test}.txt`, 'utf-8')
    data.push([text, require(`./${test}.json`)])
  }

  data.forEach(function (a) {
    it('should not error', function () {
      assert.doesNotThrow(() => {
        const data = mojangson.parse(a[0])
        data.name = 'test' // nbt needs a name
        nbt.writeUncompressed(data)
      })
    })
  })
})
