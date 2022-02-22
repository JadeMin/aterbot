module.exports = loader

const emptyBiome = {
  color: 0,
  height: null,
  name: '',
  rainfall: 0,
  temperature: 0
}

function loader (registryOrVersion) {
  const registry = typeof registryOrVersion === 'string' ? require('prismarine-registry')(registryOrVersion) : registryOrVersion
  const biomes = registry.biomes
  return function Biome (id) {
    return biomes?.[id] || { ...emptyBiome, id }
  }
}
