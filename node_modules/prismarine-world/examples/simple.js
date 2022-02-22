const World = require('../index')('1.16')
const Chunk = require('prismarine-chunk')('1.16')
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

const world = new World(generateSimpleChunk)

async function main () {
  world.on('blockUpdate', (oldBlock, newBlock) => {
    console.log('blockUpdate', oldBlock.stateId, newBlock.stateId)
  })
  world.on('blockUpdate:(3, 50, 3)', (oldBlock, newBlock) => {
    console.log('blockUpdate:(3, 50, 3)', oldBlock.stateId, newBlock.stateId)
  })
  const pos = new Vec3(3, 50, 3)
  console.log('initial', await world.getBlockStateId(pos))
  await world.setBlockStateId(pos, 47)
  console.log('last', await world.getBlockStateId(pos))
}

main()
