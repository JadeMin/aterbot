const posKey = (pos) => `${pos.x},${pos.y},${pos.z}`

class CommonChunkColumn {
  constructor (registry) {
    this.registry = registry
    // Just a collection of deserialized NBTs
    this.blockEntities = {}
    this.minY = 0
  }

  // Some section getters, used by anvil-provider

  getSection (pos) {
    return this.sections[(pos.y - this.minY) >> 4]
  }

  getSectionAtIndex (index) {
    const minY = this.minY >> 4
    return this.sections[index - minY]
  }

  // Biomes

  getBiomeId (pos) {
    return this.getBiome(pos)
  }

  setBiomeId (pos, biome) {
    this.setBiome(pos, biome)
  }

  getBiomeData (pos) {
    const biome = this.getBiome(pos)
    return this.registry[biome]
  }

  getBiomeColor (pos) {
    const { color } = this.getBiomeData(pos)
    const r = color >> 16
    const g = (color >> 8) & 0xff
    const b = color & 0xff
    return { r, g, b }
  }

  setBiomeColor () {
    throw new Error('Cannot change biome color, update the biome instead')
  }

  // Block entities

  getBlockEntity (pos) {
    return this.blockEntities[posKey(pos)]
  }

  setBlockEntity (pos, tag) {
    // Note: `pos` is relative to the chunk, not the world, tag's XYZ is
    this.blockEntities[posKey(pos)] = tag
  }

  removeBlockEntity (pos) {
    delete this.blockEntities[posKey(pos)]
  }

  loadBlockEntities (entities) {
    for (const entity of entities) {
      this.setBlockEntity({ x: entity.x.value >> 4, y: entity.y.value, z: entity.z.value >> 4 }, entity)
    }
  }
}

module.exports = CommonChunkColumn
