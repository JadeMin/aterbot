/* eslint-env mocha */
const assert = require('assert')
const mojangson = require('../')
const data = require('./stringify_test_data.js')

describe('test mojangson.stringify', () => {
  data.forEach(entry => {
    it('should be equal', () => {
      const results = mojangson.stringify(mojangson.parse(entry[0]))
      assert.strictEqual(results, entry[1])
    })
  })
})
