const Vec3 = require('vec3').Vec3
const { ManhattanIterator, SpiralIterator2d, OctahedronIterator } = require('../index').iterators

console.info('Octahedron Iterator 3D:\n' + iterate3d(new OctahedronIterator(new Vec3(0, 0, 0), 2)))
console.info('ManhattanIterator Iterator:\n' + iterate2d(new ManhattanIterator(0, 0, 5)))
console.info('SpiralIterator2d Iterator:\n' + iterate2d(new SpiralIterator2d(new Vec3(0, 0, 0), 4)))

function iterate3d (iter) {
  let n = iter.next()
  const result = []
  const size = 3
  let counter = 0
  for (let x = 0; x < size * 2; x++) {
    for (let y = 0; y < size * 2; y++) {
      if (!result[x]) result[x] = []
      for (let z = 0; z < size * 2; z++) {
        if (!result[x][y]) result[x][y] = []
        result[x][y][z] = '   '
      }
    }
  }
  console.info(result)
  while (n) {
    result[n.x + size][n.y + size][n.z + size] = pad(counter)
    counter = counter + 1
    n = iter.next()
  }
  let str = 'Layer 0:  ...\n'
  for (let x = 0; x < size * 2; x++) {
    let line = ''
    for (let y = 0; y < size * 2; y++) {
      for (let z = 0; z < size * 2; z++) {
        line += '|' + pad(result[x][y][z])
      }
      line += '  '
    }
    str += line + '\n'
  }
  return str
}

function iterate2d (iter) {
  let n = iter.next()
  const result = []
  const size = 5
  let counter = 0
  for (let x = 0; x < size * 2; x++) {
    for (let z = 0; z < size * 2; z++) {
      if (!result[x]) result[x] = []
      result[x][z] = '   '
    }
  }
  while (n) {
    result[n.x + size][n.z + size] = pad(counter)
    counter = counter + 1
    n = iter.next()
  }
  let str = ''
  for (let x = 0; x < size * 2; x++) {
    for (let z = 0; z < size * 2; z++) {
      str += '|' + result[x][z]
    }
    str += '|\n'
  }
  return str
}

function pad (num) {
  return num.toString().padStart(3, ' ')
}
