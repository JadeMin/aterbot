/* eslint-env mocha */

const flatMap = require('flatmap')
const range = require('range').range
const bufferEqual = require('buffer-equal')
const World = require('../')('1.8')
const Chunk = require('prismarine-chunk')('1.8')
const Vec3 = require('vec3').Vec3
const assert = require('assert')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const Anvil = require('prismarine-provider-anvil').Anvil('1.8')

describe('saving and loading works', function () {
  function generateRandomChunk (chunkX, chunkZ) {
    const chunk = new Chunk()

    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        chunk.setBlockType(new Vec3(x, 50, z), Math.floor(Math.random() * 50))
        for (let y = 0; y < 256; y++) {
          chunk.setSkyLight(new Vec3(x, y, z), 15)
        }
      }
    }

    return chunk
  }

  const regionPath = 'world/testRegion'
  before((cb) => {
    mkdirp(regionPath, cb)
  })

  after(cb => {
    rimraf(regionPath, cb)
  })

  let originalWorld
  const size = 3

  it('save the world', async () => {
    originalWorld = new World(generateRandomChunk, new Anvil(regionPath))
    await Promise.all(
      flatMap(range(0, size), (chunkX) => range(0, size).map(chunkZ => ({ chunkX, chunkZ })))
        .map(({ chunkX, chunkZ }) => originalWorld.getColumn(chunkX, chunkZ))
    )
    await originalWorld.waitSaving()
  })

  it('load the world correctly', async () => {
    const loadedWorld = new World(null, new Anvil(regionPath))
    await Promise.all(
      flatMap(range(0, size), (chunkX) => range(0, size).map(chunkZ => ({ chunkX, chunkZ })))
        .map(async ({ chunkX, chunkZ }) => {
          const originalChunk = await originalWorld.getColumn(chunkX, chunkZ)
          const loadedChunk = await loadedWorld.getColumn(chunkX, chunkZ)
          assert.strictEqual(originalChunk.getBlockType(new Vec3(0, 50, 0)), loadedChunk.getBlockType(new Vec3(0, 50, 0)), 'wrong block type at 0,50,0 of chunk ' + chunkX + ',' + chunkZ)
          assert(bufferEqual(originalChunk.dump(), loadedChunk.dump()))
        })
    )
  })

  it('setBlocks', async () => {
    const world = new World(null, new Anvil(regionPath))
    for (let i = 0; i < 10000; i++) {
      await world.setBlockType(new Vec3(Math.random() * (16 * size - 1), Math.random() * 255, Math.random() * (16 * size - 1)), 0)
    }
    await world.waitSaving()
  })
})

describe('Synchronous saving and loading works', function () {
  function generateRandomChunk (chunkX, chunkZ) {
    const chunk = new Chunk()

    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        chunk.setBlockType(new Vec3(x, 50, z), Math.floor(Math.random() * 50))
        for (let y = 0; y < 256; y++) {
          chunk.setSkyLight(new Vec3(x, y, z), 15)
        }
      }
    }

    return chunk
  }

  const regionPath = 'world/testRegionSync'
  before((cb) => {
    mkdirp(regionPath, cb)
  })

  after(cb => {
    rimraf(regionPath, cb)
  })

  let originalWorld
  const size = 3

  it('saving the world', async () => {
    originalWorld = new World(generateRandomChunk, new Anvil(regionPath))
    await Promise.all(
      flatMap(range(0, size), (chunkX) => range(0, size).map(chunkZ => ({ chunkX, chunkZ })))
        .map(({ chunkX, chunkZ }) => originalWorld.getColumn(chunkX, chunkZ))
    )
    await originalWorld.waitSaving()
  })

  it('load the world correctly', async () => {
    const loadedWorld = new World(null, new Anvil(regionPath))
    await Promise.all(
      flatMap(range(0, size), (chunkX) => range(0, size).map(chunkZ => ({ chunkX, chunkZ })))
        .map(async ({ chunkX, chunkZ }) => {
          await loadedWorld.getColumn(chunkX, chunkZ)
          const originalChunk = originalWorld.sync.getColumn(chunkX, chunkZ)
          const loadedChunk = loadedWorld.sync.getColumn(chunkX, chunkZ)
          assert.strictEqual(originalChunk.getBlockType(new Vec3(0, 50, 0)), loadedChunk.getBlockType(new Vec3(0, 50, 0)), 'wrong block type at 0,50,0 of chunk ' + chunkX + ',' + chunkZ)
          assert(bufferEqual(originalChunk.dump(), loadedChunk.dump()))
        })
    )
  })

  it('setBlocks', async () => {
    const world = new World(null, new Anvil(regionPath))
    for (let i = 0; i < 10000; i++) {
      world.sync.setBlockType(new Vec3(Math.random() * (16 * size - 1), Math.random() * 255, Math.random() * (16 * size - 1)), 0)
    }
    await world.waitSaving()
  })
})
