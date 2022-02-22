/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')
const mojangson = require('../')

const tests = ['test001', 'test002']

describe('additional', function () {
  const data = []
  for (const test of tests) {
    const text = fs.readFileSync(`test/${test}.txt`, 'utf-8')
    data.push([text, require(`./${test}.json`)])
  }

  data.forEach(function (a) {
    it('should be equal', function () {
      assert.deepStrictEqual(mojangson.parse(a[0]), a[1])
    })
  })
})
