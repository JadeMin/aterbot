const BiomeSection = require('./BiomeSection')

/**
 * Micro-optimization from Mojang's 1.18.x chunk implementation..
 * Biome sections can point to n-1 section if the data is the same in section `n` and `n-1`
 * How it works: Server sends biome data for each chunk section from ground up to the world section height.
 * Ground up, if the biome data is the same as the previous section, it is encoded with a special 0xff
 * bitsPerValue which indicates to the client that the biome data is the same as the previous section.
 * We implement that here with ProxyBiomeSection which sends all the get's over to the previous section.
 * This can be chained to any number of sections, as a linked list. When updating the biome data, ChunkColumn
 * will call the promote() function to turn this into a proper BiomeSection and update the BS pointer.
 *
 * Another possible way to implement would be to just read these sections as null
 *
 * We don't need to implement this optimization, but we do to make buffer equality tests pass when
 * decoding/re-encoding Minecraft network chunk data.
 */
class ProxyBiomeSection {
  constructor (registry, target) {
    this.registry = registry
    this.target = target
  }

  getBiome (pos) {
    return this.target.getBiome(pos)
  }

  getBiomeId (pos) {
    return this.target.getBiomeId(pos)
  }

  copy (other) {
    return this.target.copy(other)
  }

  promote (y) {
    const biome = new BiomeSection(this.registry, y)
    biome.copy(this.target)
    return biome
  }

  export (format, stream) {
    stream.writeUInt8(0xff)
  }
}

module.exports = ProxyBiomeSection
