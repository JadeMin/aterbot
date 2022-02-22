/* eslint-env mocha */
const assert = require('assert')

describe('load', () => {
  it('loads the lib', () => {
    require('minecraft-data')
    require('../example')
  })
  it('run the example', () => {
    require('../example')
  })
  it('newerOrEqualTo', () => {
    const mcData = require('minecraft-data')('1.13.2')
    assert.strictEqual(mcData.isNewerOrEqualTo('1.13'), true)
    assert.strictEqual(mcData.isOlderThan('1.14'), true)
    assert.strictEqual(mcData.isOlderThan('1.13'), false)
    assert.strictEqual(mcData.isNewerOrEqualTo('1.14'), false)
    assert.strictEqual(mcData.isNewerOrEqualTo('1.1'), true)

    const firstDataVersion = require('minecraft-data')('15w32a') // dataVersion = 100
    assert.strictEqual(firstDataVersion.isNewerOrEqualTo('15w31c'), true) // no dataVersion
  })
})

describe('versions with block data have block state IDs', () => {
  const mcData = require('minecraft-data')
  const versions = require('minecraft-data').versions
  let oks = 0
  for (const type in versions) {
    for (const version of versions[type]) {
      it(type + ' ' + version.minecraftVersion, () => {
        const data = mcData(type + '_' + version.minecraftVersion)
        if (data?.blocks) {
          for (const block of data.blocksArray) {
            assert.ok(block.defaultState > -1)
            oks++
          }
        }
      })
    }
  }
  after(() => {
    console.log(oks, 'OKs')
    assert(oks > 0)
  })
})
