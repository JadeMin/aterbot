const Chunk = require('./')('1.8')
const Vec3 = require('vec3')

const chunk = new Chunk()
for (let x = 0; x < Chunk.w; x++) {
  for (let z = 0; z < Chunk.l; z++) {
    chunk.setBlockType(new Vec3(x, 50, z), 2)
    for (let y = 0; y < Chunk.h; y++) {
      chunk.setSkyLight(new Vec3(x, y, z), 15)
    }
  }
}

console.log(JSON.stringify(chunk.getBlock(new Vec3(3, 50, 3)), null, 2))
