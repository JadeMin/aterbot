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

    const mcData188 = require('minecraft-data')('1.8.8')
    assert.strictEqual(mcData188.isNewerOrEqualTo('1.8'), true, '1.8.8>1.8')

    const mcDataBedrock1Dot7Dot10 = require('minecraft-data')('bedrock_1.17.10')
    assert.strictEqual(mcDataBedrock1Dot7Dot10.isNewerOrEqualTo('1.17'), true, '1.17.10>1.17')

    const bedrock16220 = require('minecraft-data')('bedrock_1.16.220')
    assert.strictEqual(bedrock16220.isNewerOrEqualTo('1.16.210'), true, 'bedrock_1.16.220>bedrock_1.16.210')
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

describe('supportFeature', () => {
  it('dimensionIsAnInt is only accessible in 1.8 - 1.15.2', () => {
    const mcData1Dot9 = require('minecraft-data')('1.9')
    const mcData1Dot17 = require('minecraft-data')('1.17')
    assert.equal(mcData1Dot9.supportFeature('dimensionIsAnInt'), true)
    assert.equal(mcData1Dot17.supportFeature('dimensionIsAnInt'), false)
  })

  it('metadataIxOfItem works right', () => {
    const assertions = {
      1.18: 8,
      1.17: 8,
      '1.16.1': 7,
      1.16: 7,
      1.15: 7,
      '1.13.2': 6,
      '1.10': 6,
      '1.9.1': 5,
      1.9: 5,
      1.8: 8
    }
    for (const [k, v] of Object.entries(assertions)) {
      const mcData = require('minecraft-data')(k)
      const newVal = mcData.supportFeature('metadataIxOfItem')
      assert.equal(newVal, v, `Failed on mc version ${k} | Expected: ${v}, Got: ${newVal}`)
    }
  })

  it('handles "_major" correctly on itemSerializationUsesBlockId', function () {
    const mcData1Dot9 = require('minecraft-data')('1.9')
    const mcData1Dot17 = require('minecraft-data')('1.12.2')
    assert.equal(mcData1Dot9.supportFeature('itemSerializationUsesBlockId'), true)
    assert.equal(mcData1Dot17.supportFeature('itemSerializationUsesBlockId'), true)
  })

  it('works on bedrock', function () {
    const mcData = require('minecraft-data')('bedrock_1.18.0')
    assert.equal(mcData.supportFeature('newRecipeSchema'), true)
    assert.equal(mcData.supportFeature('fakeRecipeSchema'), false)
  })
})
