/* eslint-env mocha */

'use strict'

const nbt = require('../nbt')
const expect = require('chai').expect

describe('cross encode', function () {
  it('re-encodes', async function () {
    const write = {
      type: 'compound',
      name: '',
      value: {
        FireworksItem: {
          type: 'compound',
          value: {
            FireworkColor: {
              type: 'byteArray',
              value: [
                11
              ]
            },
            FireworkFade: {
              type: 'byteArray',
              value: []
            },
            FireworkFlicker: {
              type: 'int',
              value: -79
            },
            FireworkTrail: {
              type: 'int',
              value: 22
            },
            FireworkType: {
              type: 'byte',
              value: 0
            }
          }
        },
        customColor: {
          type: 'long',
          value: [-1, -75715]
        }
      }
    }

    const tests = ['big', 'little']
    for (const test of tests) {
      const written = nbt.writeUncompressed(write, test)
      const { parsed } = await nbt.parse(written)
      expect(parsed).to.deep.equal(write)
      for (const _test of tests) {
        const _written = nbt.writeUncompressed(parsed, _test)
        const _ = await nbt.parse(_written)
        expect(_.parsed).to.deep.equal(write)
      }
    }
  })
})
