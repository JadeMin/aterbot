module.exports = mcDataToNode

function mcDataToNode (mcData) {
  const indexes = require('./indexes.js')(mcData)
  return {
    blocks: indexes.blocksById,
    blocksByName: indexes.blocksByName,
    blocksArray: mcData.blocks,
    blocksByStateId: indexes.blocksByStateId,

    blockStates: mcData.blockStates, // bedrock

    blockCollisionShapes: mcData.blockCollisionShapes,

    biomes: indexes.biomesById,
    biomesByName: indexes.biomesByName,
    biomesArray: mcData.biomes,

    items: indexes.itemsById,
    itemsByName: indexes.itemsByName,
    itemsArray: mcData.items,

    foods: indexes.foodsById,
    foodsByName: indexes.foodsByName,
    foodsByFoodPoints: indexes.foodsByFoodPoints,
    foodsBySaturation: indexes.foodsBySaturation,
    foodsArray: mcData.foods,

    recipes: mcData.recipes,

    instruments: indexes.instrumentsById,
    instrumentsArray: mcData.instruments,

    materials: mcData.materials,

    enchantments: indexes.enchantmentsById,
    enchantmentsByName: indexes.enchantmentsByName,
    enchantmentsArray: mcData.enchantments,

    mobs: indexes.mobsById,
    objects: indexes.objectsById,
    entitiesByName: indexes.entitiesByName,
    entitiesArray: mcData.entities,

    windows: indexes.windowsById,
    windowsByName: indexes.windowsByName,
    windowsArray: mcData.windows,

    protocol: mcData.protocol,
    protocolComments: mcData.protocolComments,
    protocolYaml: [mcData.proto, mcData.types], // bedrock

    defaultSkin: mcData.steve, // bedrock

    version: mcData.version,

    effects: indexes.effectsById,
    effectsByName: indexes.effectsByName,
    effectsArray: mcData.effects,

    attributes: indexes.attributesByResource,
    attributesByName: indexes.attributesByName,
    attributesArray: mcData.attributes,

    particles: indexes.particlesById,
    particlesByName: indexes.particlesByName,
    particlesArray: mcData.particles,

    language: mcData.language,

    blockLoot: indexes.blockLootByName,
    blockLootArray: mcData.blockLoot,

    entityLoot: indexes.entityLootByName,
    entityLootArray: mcData.entityLoot,

    commands: mcData.commands,

    loginPacket: mcData.loginPacket,

    mapIcons: indexes.mapIconsById,
    mapIconsByName: indexes.mapIconsByName,
    mapIconsArray: mcData.mapIcons,

    tints: mcData.tints,

    findItemOrBlockById: function (id) {
      const item = indexes.itemsById[id]
      if (item !== undefined) return item
      return indexes.blocksById[id]
    },
    findItemOrBlockByName: function (name) {
      const item = indexes.itemsByName[name]
      if (item !== undefined) return item
      return indexes.blocksByName[name]
    }
  }
}
