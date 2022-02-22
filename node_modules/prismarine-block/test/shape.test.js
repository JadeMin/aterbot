/* eslint-env mocha */

const testedVersions = require('..').testedVersions
const assert = require('assert')

testedVersions.forEach(version => {
  describe(version, () => {
    const registry = require('prismarine-registry')(version)
    const blockArray = registry.blocksArray
    const Block = require('prismarine-block')(registry)
    blockArray.forEach(block => {
      it('shape ' + block.name, () => {
        const blockV = new Block(block.id, 0, 0, block.defaultState)
        assert.ok(blockV.shapes !== undefined)
        if (blockV.missingStateShape !== undefined) {
          console.log(`state shape of ${block.name} is missing`)
        }
      })
    })
  })
})
