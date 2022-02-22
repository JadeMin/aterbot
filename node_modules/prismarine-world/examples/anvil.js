const World = require('../index')('1.16')
const Chunk = require('prismarine-chunk')('1.16')
const Anvil = require('prismarine-provider-anvil').Anvil('1.16')
const Vec3 = require('vec3')

function generateSimpleChunk (chunkX, chunkZ) {
  const chunk = new Chunk()

  for (let x = 0; x < 16; x++) {
    for (let z = 0; z < 16; z++) {
      chunk.setBlockType(new Vec3(x, 50, z), 2)
      for (let y = 0; y < 256; y++) {
        chunk.setSkyLight(new Vec3(x, y, z), 15)
      }
    }
  }

  return chunk
}

if (process.argv.length !== 4) {
  console.log('Usage : node anvil.js <regionPath> <noGeneration>')
  process.exit(1)
}

const regionPath = process.argv[2]
const noGeneration = process.argv[3] === 'yes'

const world2 = new World(noGeneration ? null : generateSimpleChunk, new Anvil(regionPath))

world2
  .getBlock(new Vec3(3, 50, 3))
  .then(function (block) {
    console.log(JSON.stringify(block, null, 2))
  })
  // .then(function(){return world2.setBlockType(new Vec3(3000,50,3),3)})
  .then(function () { return world2.getBlock(new Vec3(3000, 50, 3)) })
  .then(function (block) {
    console.log(JSON.stringify(block, null, 2))
  })
  .then(function () {
    world2.stopSaving()
  })
  .catch(function (err) {
    console.log(err.stack)
  })
