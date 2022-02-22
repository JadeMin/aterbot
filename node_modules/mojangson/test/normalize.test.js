/* eslint-env mocha */
const assert = require('assert')
const mojangson = require('../')
const data = require('./stringify_test_data.js')

describe('test mojangson.normalize', () => {
  data.forEach(entry => {
    it('should be equal', () => {
      const results = mojangson.normalize(entry[0])
      assert.strictEqual(results, entry[1])
    })
  })
})
