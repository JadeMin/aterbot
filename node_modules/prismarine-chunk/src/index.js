const chunkImplementations = {
  pc: {
    1.8: require('./pc/1.8/chunk'),
    1.9: require('./pc/1.9/chunk'),
    '1.10': require('./pc/1.9/chunk'),
    1.11: require('./pc/1.9/chunk'),
    1.12: require('./pc/1.9/chunk'),
    1.13: require('./pc/1.13/chunk'),
    1.14: require('./pc/1.14/chunk'),
    1.15: require('./pc/1.15/chunk'),
    1.16: require('./pc/1.16/chunk'),
    1.17: require('./pc/1.17/chunk'),
    1.18: require('./pc/1.18/chunk')
  },
  bedrock: {
    0.14: require('./bedrock/0.14/chunk'),
    '1.0': require('./bedrock/1.0/chunk'),
    1.3: require('./bedrock/1.3/chunk'),
    1.16: require('./bedrock/1.3/chunk'),
    1.17: require('./bedrock/1.3/chunk'),
    1.18: require('./bedrock/1.18/chunk')
  }
}

module.exports = loader
// Caching
const blobCache = require('./bedrock/common/BlobCache')
module.exports.BlobEntry = blobCache.BlobEntry
module.exports.BlobType = blobCache.BlobType

function loader (registryOrVersion) {
  const registry = typeof registryOrVersion === 'string' ? require('prismarine-registry')(registryOrVersion) : registryOrVersion
  const version = registry.version
  try {
    return chunkImplementations[version.type][version.majorVersion](registry)
  } catch (e) {
    if (e instanceof TypeError) {
      console.error(e)
      throw new Error(`[Prismarine-chunk] No chunk implementation for ${version?.type} ${version?.majorVersion} found`)
    } else {
      console.log(`Error while loading ${version.type} - ${version.majorVersion}`)
      throw e
    }
  }
}
