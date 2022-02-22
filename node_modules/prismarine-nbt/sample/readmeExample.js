const fs = require('fs')
const { parse, writeUncompressed } = require('../nbt')

async function main (file) {
  if (!file) {
    console.error('./readmeExample [path to nbt file]')
    process.exit(1)
  }
  const buffer = await fs.promises.readFile(file)
  const { parsed, type } = await parse(buffer)
  const big2array = (v) => [BigInt.asIntN(32, v >> 32n), BigInt.asIntN(32, v)]
  const json = JSON.stringify(parsed, (k, v) => typeof v === 'bigint' ? big2array(v) : v)
  console.log('JSON serialized:', json, type)

  // Write it back
  const outBuffer = fs.createWriteStream('file.nbt')
  const newBuf = writeUncompressed(parsed, type)
  outBuffer.write(newBuf)
  outBuffer.end(() => console.log('written!'))
}

main(process.argv[2])
