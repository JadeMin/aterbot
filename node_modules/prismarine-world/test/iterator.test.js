/* eslint-env mocha */

const { SpiralIterator2d } = require('../src/iterators')
const { Vec3 } = require('vec3')
const expect = require('expect')

describe('Spiral iterator', () => {
  it('simple function test', async () => {
    const startPos = new Vec3(0, 0, 0)
    const iter = new SpiralIterator2d(startPos, 2)
    const first = iter.next()
    const second = iter.next()

    expect(first.x === startPos.x && first.y === startPos.y && first.z === startPos.z).toBeTruthy()
    expect(second.x === startPos.x && second.y === startPos.y && second.z === startPos.z).toBeFalsy()
  })
})
