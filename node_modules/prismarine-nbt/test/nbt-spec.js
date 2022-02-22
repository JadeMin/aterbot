/* eslint-env mocha */

'use strict'

const fs = require('fs')
const nbt = require('../nbt')
const expect = require('chai').expect
const crypto = require('crypto')

describe('nbt.parse', function () {
  function checkBigtest (data) {
    expect(data.value.stringTest.value).to.equal(
      'HELLO WORLD THIS IS A TEST STRING ÅÄÖ!')
    expect(data.value['nested compound test'].value).to.deep.equal({
      ham: {
        type: 'compound',
        value: {
          name: { type: 'string', value: 'Hampus' },
          value: { type: 'float', value: 0.75 }
        }
      },
      egg: {
        type: 'compound',
        value: {
          name: { type: 'string', value: 'Eggbert' },
          value: { type: 'float', value: 0.5 }
        }
      }
    })
  }

  it('parses a compressed NBT file', function (done) {
    fs.readFile('sample/bigtest.nbt.gz', function (error, data) {
      if (error) {
        throw error
      }
      nbt.parse(data, function (err, data) {
        if (err) {
          throw error
        }
        checkBigtest(data)
        done()
      })
    })
  })

  it('parses an uncompressed NBT file through parse()', function (done) {
    fs.readFile('sample/bigtest.nbt', function (error, data) {
      if (error) {
        throw error
      }
      nbt.parse(data, function (error, data) {
        if (error) {
          throw error
        }
        checkBigtest(data)
        done()
      })
    })
  })
})

describe('nbt.write', function () {
  it('writes an uncompressed NBT file', function (done) {
    fs.readFile('sample/bigtest.nbt', function (err, nbtdata) {
      if (err) {
        throw err
      }
      const w = nbt.writeUncompressed(require('../sample/bigtest'))
      expect(w).to.deep.equal(nbtdata)
      done()
    })
  })

  it('re-encodes it input perfectly', function () {
    const input = require('../sample/bigtest')
    const output = nbt.writeUncompressed(input)
    const decodedOutput = nbt.parseUncompressed(output)
    expect(decodedOutput).to.deep.equal(input)
  })
})

describe('little endian read write', function () {
  this.timeout(5000)

  it('reads and writes le varint tags', async () => {
    const data = fs.readFileSync('sample/block_states.lev.nbt')
    const dataOut = fs.createWriteStream('out-block-states.nbt')
    data.startOffset = 0
    const results = []
    while (data.startOffset !== data.length) {
      const { parsed, type, metadata } = await nbt.parse(data)
      expect(type).to.equal('littleVarint')
      data.startOffset += metadata.size
      results.push(parsed)

      const newBuf = nbt.writeUncompressed(parsed, 'littleVarint')
      dataOut.write(newBuf)
    }

    await new Promise(resolve => dataOut.end(() => resolve()))

    const shaA = await checksumFile('sha1', 'sample/block_states.lev.nbt')
    const shaB = await checksumFile('sha1', 'out-block-states.nbt')
    expect(shaA).to.equal(shaB)
    return true
  })

  it('re-encodes little endian tags', async () => {
    const dataOut = fs.createWriteStream('out-le-level.dat')
    const nbtdata = fs.readFileSync('sample/level.dat')

    const { parsed, type } = await nbt.parse(nbtdata)
    expect(type).to.equal('little')
    const newBuf = nbt.writeUncompressed(parsed, 'little')
    dataOut.write(newBuf)
    dataOut.end()

    const newSha1 = await checksumFile('sha1', 'out-le-level.dat')
    expect(newSha1).to.equal('68e5942abe6bc92aefb02a2195b4ec359ffa3286')
    return true
  })
})

function checksumFile (algorithm, path) {
  return new Promise((resolve, reject) =>
    fs.createReadStream(path)
      .on('error', reject)
      .pipe(crypto.createHash(algorithm)
        .setEncoding('hex'))
      .once('finish', function () {
        resolve(this.read())
      })
  )
}
