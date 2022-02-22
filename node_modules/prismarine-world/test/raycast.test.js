/* eslint-env jest */

const World = require('prismarine-world')('1.16.4')
const Chunk = require('prismarine-chunk')('1.16.4')
const mcData = require('minecraft-data')('1.16.4')
const { Vec3 } = require('vec3')
const assert = require('assert')

describe('raycasting', function () {
  function generateFlatChunk () {
    const chunk = new Chunk()
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        chunk.setBlockType(new Vec3(x, 0, z), mcData.blocksByName.bedrock.id)
        chunk.setBlockType(new Vec3(x, 1, z), mcData.blocksByName.dirt.id)
        chunk.setBlockType(new Vec3(x, 2, z), mcData.blocksByName.dirt.id)
        chunk.setBlockType(new Vec3(x, 3, z), mcData.blocksByName.grass_block.id)
      }
    }
    return chunk
  }

  const world = new World(generateFlatChunk, null)

  it('raycast cardinals', async () => {
    const head = new Vec3(0, 5.6, 0)
    for (const dir of [new Vec3(1, -1, 0), new Vec3(-1, -1, 0), new Vec3(0, -1, 1), new Vec3(0, -1, -1)]) {
      const block = await world.raycast(head, dir.normalize(), 10)
      assert.notStrictEqual(block, null)
    }
  })

  it('raycast diagonals', async () => {
    const head = new Vec3(0, 5.6, 0)
    for (const dir of [new Vec3(1, -1, 1), new Vec3(-1, -1, -1), new Vec3(-1, -1, 1), new Vec3(1, -1, -1)]) {
      const block = await world.raycast(head, dir.normalize(), 10)
      assert.notStrictEqual(block, null)
    }
  })

  it('raycast up/down', async () => {
    const head = new Vec3(0, 5.6, 0)
    const up = await world.raycast(head, new Vec3(0, 1, 0), 10)
    assert.strictEqual(up, null)

    const down = await world.raycast(head, new Vec3(0, -1, 0), 10)
    assert.notStrictEqual(down, null)
  })
})
