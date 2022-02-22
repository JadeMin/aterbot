const nbt = require('prismarine-nbt')

module.exports = {
  networkBiomesToMcDataSchema (biome, staticData) {
    const name = biome.name.replace('minecraft:', '')
    const equivalent = staticData.biomesByName[name]
    return Object.assign(biome.element, {
      ...equivalent,
      id: biome.id,
      name,
      category: biome.element.category,
      temperature: biome.element.temperature,
      depth: biome.element.depth,
      scale: biome.element.scale,
      precipitation: biome.element.precipitation,
      rainfall: biome.element.downfall
    })
  },

  mcDataSchemaToNetworkBiomes (dynBiomeData, staticData) {
    const ret = []

    if (!dynBiomeData) {
      for (const biome of staticData.biomesArray) {
        ret.push({
          name: nbt.string('minecraft:' + biome.name),
          id: nbt.int(biome.id),
          element: nbt.comp({
            depth: nbt.float(biome.depth),
            scale: nbt.float(biome.scale),
            category: nbt.string(biome.category),
            temperature: nbt.float(biome.temperature),
            precipitation: nbt.string(biome.precipitation),
            downfall: nbt.float(biome.rainfall),
            effects: {
              // TODO: we need to add more data to static biomes.json
              sky_color: nbt.int(biome.color)
            }
          })
        })
      }
    } else {
      for (const biome of dynBiomeData) {
        const oldEffects = Object.entries(biome.effects).map(([k, v]) => ({
          [k]: nbt.int(v)
        })).reduce((a, b) => Object.assign(a, b), {})
        ret.push({
          name: nbt.string('minecraft:' + biome.name),
          id: nbt.int(biome.id),
          element: nbt.comp({
            depth: nbt.float(biome.depth),
            scale: nbt.float(biome.scale),
            category: nbt.string(biome.category),
            temperature: nbt.float(biome.temperature),
            precipitation: nbt.string(biome.precipitation),
            downfall: nbt.float(biome.rainfall),
            effects: nbt.comp({
              ...oldEffects,
              mood_sound: biome.effects?.mood_sound
                ? nbt.comp({
                    tick_delay: nbt.int(biome.effects.mood_sound.tick_delay),
                    offset: nbt.double(biome.effects.mood_sound.offset),
                    sound: nbt.string(biome.effects.mood_sound.sound),
                    block_search_extent: nbt.int(biome.effects.mood_sound.block_search_extent)
                  })
                : undefined
            })
          })
        })
      }
    }

    return ret
  }
}
