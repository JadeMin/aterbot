const { Vec3 } = require('vec3')

const BlockFace = {
  UNKNOWN: -999,
  BOTTOM: 0,
  TOP: 1,
  NORTH: 2,
  SOUTH: 3,
  WEST: 4,
  EAST: 5
}

// 2D spiral iterator, useful to iterate on
// columns that are centered on bot position
// https://en.wikipedia.org/wiki/Taxicab_geometry
class ManhattanIterator {
  constructor (x, y, maxDistance) {
    this.maxDistance = Math.floor(maxDistance)
    this.startx = x
    this.starty = y
    this.x = 2
    this.y = -1
    this.layer = 1
    this.leg = -1
  }

  next () {
    if (this.leg === -1) {
      // use -1 as the center
      this.leg = 0
      return { x: this.startx, y: this.starty }
    } else if (this.leg === 0) {
      if (this.maxDistance === 1) return null
      this.x--
      this.y++
      if (this.x === 0) this.leg = 1
    } else if (this.leg === 1) {
      this.x--
      this.y--
      if (this.y === 0) this.leg = 2
    } else if (this.leg === 2) {
      this.x++
      this.y--
      if (this.x === 0) this.leg = 3
    } else if (this.leg === 3) {
      this.x++
      this.y++
      if (this.y === 0) {
        this.x++
        this.leg = 0
        this.layer++
        if (this.layer === this.maxDistance) {
          return null
        }
      }
    }
    return new Vec3(this.startx + this.x, 0, this.starty + this.y)
  }
}

class OctahedronIterator {
  constructor (start, maxDistance) {
    this.start = start.floored()
    this.maxDistance = maxDistance
    this.apothem = 1
    this.x = -1
    this.y = -1
    this.z = -1
    this.L = this.apothem
    this.R = this.L + 1
  }

  next () {
    if (this.apothem > this.maxDistance) return null
    this.R -= 1
    if (this.R < 0) {
      this.L -= 1
      if (this.L < 0) {
        this.z += 2
        if (this.z > 1) {
          this.y += 2
          if (this.y > 1) {
            this.x += 2
            if (this.x > 1) {
              this.apothem += 1
              this.x = -1
            }
            this.y = -1
          }
          this.z = -1
        }
        this.L = this.apothem
      }
      this.R = this.L
    }
    const X = this.x * this.R
    const Y = this.y * (this.apothem - this.L)
    const Z = this.z * (this.apothem - (Math.abs(X) + Math.abs(Y)))
    return this.start.offset(X, Y, Z)
  }
}

// This iterate along a ray starting at `pos` in `dir` direction
// It steps exactly 1 block at a time, returning the block coordinates
// and the face by which the ray entered the block.
class RaycastIterator {
  constructor (pos, dir, maxDistance) {
    this.block = {
      x: Math.floor(pos.x),
      y: Math.floor(pos.y),
      z: Math.floor(pos.z),
      face: BlockFace.UNKNOWN
    }

    this.pos = pos
    this.dir = dir

    this.invDirX = (dir.x === 0) ? Number.MAX_VALUE : 1 / dir.x
    this.invDirY = (dir.y === 0) ? Number.MAX_VALUE : 1 / dir.y
    this.invDirZ = (dir.z === 0) ? Number.MAX_VALUE : 1 / dir.z

    this.stepX = Math.sign(dir.x)
    this.stepY = Math.sign(dir.y)
    this.stepZ = Math.sign(dir.z)

    this.tDeltaX = (dir.x === 0) ? Number.MAX_VALUE : Math.abs(1 / dir.x)
    this.tDeltaY = (dir.y === 0) ? Number.MAX_VALUE : Math.abs(1 / dir.y)
    this.tDeltaZ = (dir.z === 0) ? Number.MAX_VALUE : Math.abs(1 / dir.z)

    this.tMaxX = (dir.x === 0) ? Number.MAX_VALUE : Math.abs((this.block.x + (dir.x > 0 ? 1 : 0) - pos.x) / dir.x)
    this.tMaxY = (dir.y === 0) ? Number.MAX_VALUE : Math.abs((this.block.y + (dir.y > 0 ? 1 : 0) - pos.y) / dir.y)
    this.tMaxZ = (dir.z === 0) ? Number.MAX_VALUE : Math.abs((this.block.z + (dir.z > 0 ? 1 : 0) - pos.z) / dir.z)

    this.maxDistance = maxDistance
  }

  // Returns null if none of the shapes is intersected, otherwise returns intersect pos and face
  // shapes are translated by offset
  intersect (shapes, offset) {
    // Shapes is an array of shapes, each in the form of: [x0, y0, z0, x1, y1, z1]
    let t = Number.MAX_VALUE
    let f = BlockFace.UNKNOWN
    const p = this.pos.minus(offset)
    for (const shape of shapes) {
      let tmin = (shape[this.invDirX > 0 ? 0 : 3] - p.x) * this.invDirX
      let tmax = (shape[this.invDirX > 0 ? 3 : 0] - p.x) * this.invDirX
      const tymin = (shape[this.invDirY > 0 ? 1 : 4] - p.y) * this.invDirY
      const tymax = (shape[this.invDirY > 0 ? 4 : 1] - p.y) * this.invDirY

      let face = this.stepX > 0 ? BlockFace.WEST : BlockFace.EAST

      if ((tmin > tymax) || (tymin > tmax)) continue
      if (tymin > tmin) {
        tmin = tymin
        face = this.stepY > 0 ? BlockFace.BOTTOM : BlockFace.TOP
      }
      if (tymax < tmax) tmax = tymax

      const tzmin = (shape[this.invDirZ > 0 ? 2 : 5] - p.z) * this.invDirZ
      const tzmax = (shape[this.invDirZ > 0 ? 5 : 2] - p.z) * this.invDirZ

      if ((tmin > tzmax) || (tzmin > tmax)) continue
      if (tzmin > tmin) {
        tmin = tzmin
        face = this.stepZ > 0 ? BlockFace.NORTH : BlockFace.SOUTH
      }
      if (tzmax < tmax) tmax = tzmax

      if (tmin < t) {
        t = tmin
        f = face
      }
    }
    if (t === Number.MAX_VALUE) return null
    return { pos: this.pos.plus(this.dir.scaled(t)), face: f }
  }

  next () {
    if (Math.min(Math.min(this.tMaxX, this.tMaxY), this.tMaxZ) > this.maxDistance) { return null }

    if (this.tMaxX < this.tMaxY) {
      if (this.tMaxX < this.tMaxZ) {
        this.block.x += this.stepX
        this.tMaxX += this.tDeltaX
        this.block.face = this.stepX > 0 ? BlockFace.WEST : BlockFace.EAST
      } else {
        this.block.z += this.stepZ
        this.tMaxZ += this.tDeltaZ
        this.block.face = this.stepZ > 0 ? BlockFace.NORTH : BlockFace.SOUTH
      }
    } else {
      if (this.tMaxY < this.tMaxZ) {
        this.block.y += this.stepY
        this.tMaxY += this.tDeltaY
        this.block.face = this.stepY > 0 ? BlockFace.BOTTOM : BlockFace.TOP
      } else {
        this.block.z += this.stepZ
        this.tMaxZ += this.tDeltaZ
        this.block.face = this.stepZ > 0 ? BlockFace.NORTH : BlockFace.SOUTH
      }
    }

    return this.block
  }
}

class SpiralIterator2d {
  /**
   * Spiral outwards from a central position in growing squares.
   * Every point has a constant distance to its previous and following position of 1. First point returned is the starting position.
   * Generates positions like this:
   * ```text
   * 16 15 14 13 12
   * 17  4  3  2 11
   * 18  5  0  1 10
   * 19  6  7  8  9
   * 20 21 22 23 24
   * (maxDistance = 2; points returned = 25)
   * ```
   * Copy and past warrior source: https://stackoverflow.com/questions/3706219/algorithm-for-iterating-over-an-outward-spiral-on-a-discrete-2d-grid-from-the-or
   * @param {Vec3} pos Starting position
   * @param {number} maxDistance Max distance from starting position
   */
  constructor (pos, maxDistance) {
    this.start = pos
    this.maxDistance = maxDistance

    this.NUMBER_OF_POINTS = Math.floor(Math.pow((Math.floor(maxDistance) - 0.5) * 2, 2))

    // (di, dj) is a vector - direction in which we move right now
    this.di = 1
    this.dj = 0
    // length of current segment
    this.segment_length = 1
    // current position (i, j) and how much of current segment we passed
    this.i = 0
    this.j = 0
    this.segment_passed = 0
    // current iteration
    this.k = 0
  }

  next () {
    if (this.k >= this.NUMBER_OF_POINTS) return null
    const output = this.start.offset(this.i, 0, this.j)

    // make a step, add 'direction' vector (di, dj) to current position (i, j)
    this.i += this.di
    this.j += this.dj
    this.segment_passed += 1

    if (this.segment_passed === this.segment_length) {
      // done with current segment
      this.segment_passed = 0

      // 'rotate' directions
      const buffer = this.di
      this.di = -this.dj
      this.dj = buffer

      // increase segment length if necessary
      if (this.dj === 0) {
        this.segment_length += 1
      }
    }
    this.k += 1
    return output
  }
}

module.exports = {
  ManhattanIterator,
  ManathanIterator: ManhattanIterator, // backward compatibility
  OctahedronIterator,
  RaycastIterator,
  SpiralIterator2d,
  BlockFace
}
