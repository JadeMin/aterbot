function loader (registry) {
  const Block = require('prismarine-block')(registry)

  return require('./ChunkColumn')(Block, registry)
}

module.exports = loader
