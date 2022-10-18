const nbt = require('prismarine-nbt')
// TOOD: remove this
nbt.float = value => ({ type: 'float', value })

const { networkBiomesToMcDataSchema, mcDataSchemaToNetworkBiomes } = require('./transforms')

module.exports = (data, staticData) => {
  let hasDynamicDimensionData = false

  return {
    loadDimensionCodec (codec) {
      const dimensionCodec = nbt.simplify(codec)

      const chat = dimensionCodec['minecraft:chat_type']?.value
      if (chat) {
        data.chatFormattingById = {}
        data.chatFormattingByName = {}
        for (const chatType of chat) {
          const d = chatType.element?.chat?.decoration
          if (!d) continue
          const n = {
            id: chatType.id,
            name: chatType.name,
            formatString: staticData.language[d.translation_key],
            parameters: d.parameters
          }
          data.chatFormattingById[chatType.id] = n
          data.chatFormattingByName[chatType.name] = n
        }
      }

      const dimensions = dimensionCodec['minecraft:dimension_type']?.value
      if (dimensions) {
        data.dimensionsById = {}
        data.dimensionsByName = {}
        for (const { name, id, element } of dimensions) {
          const n = name.replace('minecraft:', '')
          const d = {
            name: n,
            minY: element.min_y,
            height: element.height
          }
          data.dimensionsById[id] = d
          data.dimensionsByName[n] = d
        }
      }

      const biomes = dimensionCodec['minecraft:worldgen/biome']?.value
      if (!biomes) {
        return // no biome data
      }

      data.biomes = []
      data.biomesByName = {}
      data.biomesArray = []

      biomes.map(e => networkBiomesToMcDataSchema(e, staticData))

      const allBiomes = []
      for (const { name, id, element } of biomes) {
        data.biomes[id] = element
        data.biomesByName[name] = element
        allBiomes.push(element)
      }
      data.biomesArray = allBiomes
      hasDynamicDimensionData = true
    },

    writeDimensionCodec () {
      const codec = {}

      if (data.version['<']('1.16')) {
        return codec // no dimension codec in 1.15
      } else if (data.version['<']('1.16.2')) {
        return staticData.loginPacket.dimensionCodec
      } else if (data.version['>=']('1.16.2')) {
        // Keep the old dimension codec data if it exists (re-encoding)
        // We don't have this data statically, should probably be added to mcData
        if (data.dimensionsArray) {
          codec['minecraft:dimension_type'] = nbt.comp({
            type: nbt.string('minecraft:dimension_type'),
            value: nbt.list(nbt.comp(
              data.dimensionsArray.map(dimension => ({
                name: dimension.name,
                id: dimension.id,
                element: dimension.element
              }))
            ))
          })
        } else {
          codec['minecraft:dimension_type'] = staticData.loginPacket.dimensionCodec.value['minecraft:dimension_type']
        }

        // if we have dynamic biome data (re-encoding), we can count on biome.effects
        // being in place. Otherwise, we need to use static data exclusively, e.g. flying squid.
        codec['minecraft:worldgen/biome'] = nbt.comp({
          type: nbt.string('minecraft:worldgen/biome'),
          value: nbt.list(nbt.comp(mcDataSchemaToNetworkBiomes(hasDynamicDimensionData ? data.biomesArray : null, staticData)))
        })
        // 1.19
        codec['minecraft:chat_type'] = staticData.loginPacket.dimensionCodec?.value?.['minecraft:chat_type']
      }

      return nbt.comp(codec)
    }
  }
}
