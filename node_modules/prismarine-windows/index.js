function loader (mcVersion) {
  const Item = require('prismarine-item')(mcVersion)
  const Window = require('./lib/Window')(Item)
  const mcData = require('minecraft-data')(mcVersion)

  let windows
  if (mcData.isNewerOrEqualTo('1.14')) {
    // https://wiki.vg/Inventory
    windows = {}
    let protocolId = -1
    windows['minecraft:inventory'] = { type: protocolId++, inventory: { start: 9, end: 44 }, slots: 46, craft: 0, requireConfirmation: true }
    windows['minecraft:generic_9x1'] = { type: protocolId++, inventory: { start: 1 * 9, end: 1 * 9 + 35 }, slots: 1 * 9 + 36, craft: -1, requireConfirmation: true }
    windows['minecraft:generic_9x2'] = { type: protocolId++, inventory: { start: 2 * 9, end: 2 * 9 + 35 }, slots: 2 * 9 + 36, craft: -1, requireConfirmation: true }
    windows['minecraft:generic_9x3'] = { type: protocolId++, inventory: { start: 3 * 9, end: 3 * 9 + 35 }, slots: 3 * 9 + 36, craft: -1, requireConfirmation: true }
    windows['minecraft:generic_9x4'] = { type: protocolId++, inventory: { start: 4 * 9, end: 4 * 9 + 35 }, slots: 4 * 9 + 36, craft: -1, requireConfirmation: true }
    windows['minecraft:generic_9x5'] = { type: protocolId++, inventory: { start: 5 * 9, end: 5 * 9 + 35 }, slots: 5 * 9 + 36, craft: -1, requireConfirmation: true }
    windows['minecraft:generic_9x6'] = { type: protocolId++, inventory: { start: 6 * 9, end: 6 * 9 + 35 }, slots: 6 * 9 + 36, craft: -1, requireConfirmation: true }
    windows['minecraft:generic_3x3'] = { type: protocolId++, inventory: { start: 3 * 3, end: 3 * 3 + 35 }, slots: 3 * 3 + 36, craft: -1, requireConfirmation: true }
    windows['minecraft:anvil'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    windows['minecraft:beacon'] = { type: protocolId++, inventory: { start: 1, end: 36 }, slots: 37, craft: -1, requireConfirmation: true }
    windows['minecraft:blast_furnace'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    windows['minecraft:brewing_stand'] = { type: protocolId++, inventory: { start: 5, end: 40 }, slots: 41, craft: -1, requireConfirmation: true }
    windows['minecraft:crafting'] = { type: protocolId++, inventory: { start: 10, end: 45 }, slots: 46, craft: 0, requireConfirmation: true }
    windows['minecraft:enchantment'] = { type: protocolId++, inventory: { start: 2, end: 37 }, slots: 38, craft: -1, requireConfirmation: true }
    windows['minecraft:furnace'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    windows['minecraft:grindstone'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    windows['minecraft:hopper'] = { type: protocolId++, inventory: { start: 5, end: 40 }, slots: 41, craft: -1, requireConfirmation: true }
    windows['minecraft:lectern'] = { type: protocolId++, inventory: { start: 1, end: 36 }, slots: 37, craft: -1, requireConfirmation: true }
    windows['minecraft:loom'] = { type: protocolId++, inventory: { start: 4, end: 39 }, slots: 40, craft: 3, requireConfirmation: true }
    windows['minecraft:merchant'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    windows['minecraft:shulker_box'] = { type: protocolId++, inventory: { start: 27, end: 62 }, slots: 63, craft: -1, requireConfirmation: true }
    if (mcData.isNewerOrEqualTo('1.16')) {
      windows['minecraft:smithing'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    }
    windows['minecraft:smoker'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    windows['minecraft:cartography'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
    windows['minecraft:stonecutter'] = { type: protocolId++, inventory: { start: 2, end: 37 }, slots: 38, craft: 1, requireConfirmation: true }
  } else {
    // https://wiki.vg/index.php?title=Inventory&oldid=14093
    windows = {
      'minecraft:inventory': { type: 'minecraft:inventory', inventory: { start: 9, end: 44 }, slots: mcData.isNewerOrEqualTo('1.9') ? 46 : 45, craft: 0, requireConfirmation: true },
      'minecraft:chest': null,
      'minecraft:crafting_table': { type: 'minecraft:crafting_table', inventory: { start: 10, end: 45 }, slots: 46, craft: 0, requireConfirmation: true },
      'minecraft:furnace': { type: 'minecraft:furnace', inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true },
      'minecraft:dispenser': { type: 'minecraft:dispenser', inventory: { start: 7 * 9, end: 7 * 9 + 35 }, slots: 7 * 9 + 36, craft: -1, requireConfirmation: true },
      'minecraft:enchanting_table': { type: 'minecraft:enchanting_table', inventory: { start: 2, end: 37 }, slots: 38, craft: -1, requireConfirmation: true },
      'minecraft:brewing_stand': { type: 'minecraft:brewing_stand', inventory: { start: 5, end: 40 }, slots: 41, craft: -1, requireConfirmation: true },
      'minecraft:container': null,
      'minecraft:villager': { type: 'minecraft:villager', inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true },
      'minecraft:beacon': { type: 'minecraft:beacon', inventory: { start: 1, end: 36 }, slots: 37, craft: -1, requireConfirmation: true },
      'minecraft:anvil': { type: 'minecraft:anvil', inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true },
      'minecraft:hopper': { type: 'minecraft:hopper', inventory: { start: 5, end: 40 }, slots: 41, craft: -1, requireConfirmation: true },
      'minecraft:dropper': { type: 'minecraft:dropper', inventory: { start: 7 * 9, end: 7 * 9 + 35 }, slots: 7 * 9 + 36, craft: -1, requireConfirmation: true },
      'minecraft:shulker_box': { type: 'minecraft:shulker_box', inventory: { start: 27, end: 62 }, slots: 63, craft: -1, requireConfirmation: true },
      EntityHorse: null
    }
  }

  const windowByType = new Map()
  for (const key of Object.keys(windows)) {
    const win = windows[key]
    if (win) {
      windowByType.set(win.type, win)
      win.key = key
    }
  }

  return {
    createWindow: (id, type, title, slotCount = undefined) => {
      let winData = windowByType.get(type)
      if (!winData) winData = windows[type]
      if (!winData) {
        if (slotCount === undefined) return null
        winData = {
          type,
          key: type,
          inventory: { start: slotCount, end: slotCount + 35 },
          slots: slotCount + 36,
          craft: -1,
          requireConfirmation: type !== 'minecraft:container'
        }
      }
      slotCount = winData.slots
      return new Window(id, winData.key, title, slotCount, winData.inventory, winData.craft, winData.requireConfirmation)
    },
    Window,
    windows
  }
}

module.exports = loader
