const Vec3 = require('vec3').Vec3
const { OctahedronIterator } = require('../index').iterators

const iterator = new OctahedronIterator(new Vec3(0, 0, 0), 5)

while (true) {
  const n = iterator.next()
  if (n === null) {
    break
  }
  console.log(n)
}
