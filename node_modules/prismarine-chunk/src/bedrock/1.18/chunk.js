const { ChunkVersion } = require('../common/constants')
const ChunkColumn = require('./ChunkColumn')

module.exports = registry => {
  const Block = require('prismarine-block')(registry)
  return class Chunk extends ChunkColumn {
    constructor (options) {
      super(options, registry, Block)
      this.chunkVersion = this.chunkVersion || ChunkVersion.v1_18_0
      this.subChunkVersion = 9
    }

    static fromJson (str) {
      return new this(JSON.parse(str))
    }
  }
}
