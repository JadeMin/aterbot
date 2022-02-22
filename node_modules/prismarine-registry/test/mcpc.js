const collectPackets = require('./util/collectMcpcPackets')
const Registry = require('prismarine-registry')

async function main (version = '1.18') {
  const registry = Registry(version)
  let loggedIn = false
  const handlers = {
    login (version, body) {
      if (body.dimensionCodec) {
        registry.loadDimensionCodec(body.dimensionCodec)
        console.log('Loaded dimension codec', registry.biomes)

        registry.writeDimensionCodec()
        // TODO: Add proper way to compare two NBT objects in prismarine-nbt, as deepEqual will fail with incorrect sorting
        // assert.deepEqual(reEncoded, body.dimensionCodec)
        console.log('Re-encoded dimension codec')
      }
      loggedIn = true
    },

    declare_recipes (version, body) {
      // todo: load recipes
    }
  }

  await collectPackets(version, Object.keys(handlers), (name, body) => handlers[name](version, body))
  await new Promise(resolve => setTimeout(resolve, 5000))
  if (!loggedIn) {
    throw new Error('Did not login')
  }
}

module.exports = main
