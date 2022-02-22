// A type ID signifying the type of the blob.
const BlobType = {
  ChunkSection: 0,
  Biomes: 1
}

class BlobEntry {
  // When the blob was put into BlobCache store
  created = Date.now()
  // The type of blob
  type
  constructor (args) {
    Object.assign(this, args)
  }
}

module.exports = { BlobType, BlobEntry }
