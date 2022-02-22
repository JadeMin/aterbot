/* eslint-env mocha */

const expect = require('expect')

describe('test based on examples', () => {
  describe('1.8 iron shovel', () => {
    const Item = require('prismarine-item')('1.8')
    const ironShovelItem = new Item(256, 1)

    it('constructor makes item correctly', () => {
      const val = { type: 256, count: 1, metadata: 0, nbt: null, name: 'iron_shovel', displayName: 'Iron Shovel', stackSize: 1 }
      expect(JSON.parse(JSON.stringify(ironShovelItem))).toStrictEqual(val)
    })

    it('use .toNotch', () => {
      expect(Item.toNotch(ironShovelItem)).toStrictEqual({ blockId: 256, itemCount: 1, itemDamage: 0 })
    })

    it('use .fromNotch', () => {
      const toNotch = Item.toNotch(ironShovelItem)
      const fromNotch = Item.fromNotch(toNotch)
      const expectedObj = { count: 1, displayName: 'Iron Shovel', metadata: 0, name: 'iron_shovel', nbt: null, stackSize: 1, type: 256 }
      expect(JSON.parse(JSON.stringify(fromNotch))).toStrictEqual(expectedObj)
    })
  })
  describe('1.13.2 iron shovel', () => {
    const Item = require('prismarine-item')('1.13.2')
    const ironShovelItem = new Item(472, 1)

    it('constructor makes item correctly', () => {
      const expectedObj = { count: 1, displayName: 'Iron Shovel', metadata: 0, name: 'iron_shovel', nbt: null, stackSize: 1, type: 472 }
      expect(JSON.parse(JSON.stringify(ironShovelItem))).toStrictEqual(expectedObj)
    })

    it('use .toNotch', () => {
      const expectedObj = { itemCount: 1, itemId: 472, present: true }
      expect(Item.toNotch(ironShovelItem)).toStrictEqual(expectedObj)
    })

    it('use .fromNotch', () => {
      const toNotch = Item.toNotch(ironShovelItem)
      const fromNotch = Item.fromNotch(toNotch)
      const expectedObj = { count: 1, displayName: 'Iron Shovel', metadata: 0, name: 'iron_shovel', nbt: null, stackSize: 1, type: 472 }
      expect(JSON.parse(JSON.stringify(fromNotch))).toStrictEqual(expectedObj)
    })
  })
})

describe('test anvil functions', () => {
  describe('Item.getEnchants', () => {
    describe('1.8.8 test', () => {
      const Item = require('prismarine-item')('1.8.8')

      it('diamond axe with fortune 2', () => {
        const item = Item.fromNotch({ blockId: 279, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 2 }, id: { type: 'short', value: 35 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 2, name: 'fortune' }])
      })

      it('gold helmet with fire prot 3, aqua afin 1, unbr 2', () => {
        const item = Item.fromNotch({ blockId: 314, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 1 } }, { lvl: { type: 'short', value: 2 }, id: { type: 'short', value: 34 } }, { lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 6 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 3, name: 'fire_protection' }, { lvl: 2, name: 'unbreaking' }, { lvl: 1, name: 'aqua_affinity' }])
      })

      it('carrot on stick with unbr 1', () => {
        const item = Item.fromNotch({ blockId: 398, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 34 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 1, name: 'unbreaking' }])
      })

      it('stone pick with eff 4', () => {
        const item = Item.fromNotch({ blockId: 274, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 4 }, id: { type: 'short', value: 32 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 4, name: 'efficiency' }])
      })

      it('fishing rod with luck 3 lure 3', () => {
        const item = Item.fromNotch({ blockId: 346, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 61 } }, { lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 62 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 3, name: 'luck_of_the_sea' }, { lvl: 3, name: 'lure' }])
      })

      it('diamond sword (unenchanted)', () => {
        const item = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0 })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([])
      })

      it('enchanted book rename', () => {
        const item = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 3 } }] } } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 1, name: 'blast_protection' }])
      })

      it('(64x) blocks rename', () => {
        const item = Item.fromNotch({ blockId: 1, itemCount: 64, itemDamage: 0 })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([])
      })
    })
    describe('1.12.2 test', () => {
      const Item = require('prismarine-item')('1.12.2')

      it('sharp 5 dia sword', () => {
        const item = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 16 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 5, name: 'sharpness' }])
      })
      it('mending 1 elytra', () => {
        const item = Item.fromNotch({ blockId: 443, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'int', value: 1 }, id: { type: 'int', value: 70 } }] } } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 1, name: 'mending' }])
      })
    })
    describe('1.16.5 test', () => {
      const Item = require('prismarine-item')('1.16.5')
      it('diamond sword (unenchanted)', () => {
        const item = Item.fromNotch({ present: true, itemId: 603, itemCount: 1, nbtData: { type: 'compound', name: '', value: { Damage: { type: 'int', value: 0 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([])
      })
      it('iron shovel w/ eff2 for2 ub2', () => {
        const item = Item.fromNotch({ present: true, itemId: 600, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 3 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:efficiency' } }, { lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:fortune' } }, { lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:unbreaking' } }] } } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 2, name: 'efficiency' }, { lvl: 2, name: 'fortune' }, { lvl: 2, name: 'unbreaking' }])
      })
      it('ench book w/ resp1 blastprot 1', () => {
        const item = Item.fromNotch({ present: true, itemId: 848, itemCount: 1, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:respiration' } }, { lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:blast_protection' } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 1, name: 'respiration' }, { lvl: 1, name: 'blast_protection' }])
      })
      it('music disc', () => {
        const item = Item.fromNotch({ present: true, itemId: 911, itemCount: 1 })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([])
      })
      it('fishing rod w/ mending', () => {
        const item = Item.fromNotch({ present: true, itemId: 684, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:mending' } }] } } } } })
        const enchs = item.enchants
        expect(enchs).toStrictEqual([{ lvl: 1, name: 'mending' }])
      })
    })
  })
  describe('item.spawnEggMobName', () => {
    describe('1.8.9 test', () => {
      it('zombie egg', () => {
        const Item = require('prismarine-item')('1.8.9')
        const item = Item.fromNotch({ blockId: 383, itemCount: 1, itemDamage: 54 })
        expect(item.spawnEggMobName).toStrictEqual('Zombie')
      })
    })
    describe('1.11.2 test', () => {
      it('zombie egg', () => {
        const Item = require('prismarine-item')('1.11.2')
        const item = Item.fromNotch({ blockId: 383, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { EntityTag: { type: 'compound', value: { id: { type: 'string', value: 'minecraft:zombie' } } } } } })
        expect(item.spawnEggMobName).toStrictEqual('zombie')
      })
    })
    describe('1.11.2 test', () => {
      it('zombie egg', () => {
        const Item = require('prismarine-item')('1.11.2')
        const item = Item.fromNotch({ blockId: 383, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { EntityTag: { type: 'compound', value: { id: { type: 'string', value: 'minecraft:zombie' } } } } } })
        expect(item.spawnEggMobName).toStrictEqual('zombie')
      })
    })
    describe('1.11.2 test', () => {
      it('zombie egg', () => {
        const Item = require('prismarine-item')('1.11.2')
        const item = Item.fromNotch({ blockId: 383, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { EntityTag: { type: 'compound', value: { id: { type: 'string', value: 'minecraft:zombie' } } } } } })
        expect(item.spawnEggMobName).toStrictEqual('zombie')
      })
    })
    describe('1.16.5 test', () => {
      it('zombie egg', () => {
        const Item = require('prismarine-item')('1.16.5')
        const item = Item.fromNotch({ present: true, itemId: 819, itemCount: 1 })
        expect(item.spawnEggMobName).toStrictEqual('zombie')
      })
    })
  })
  describe('item.setEnchants', () => {
    describe('1.8.8 test', () => {
      const Item = require('prismarine-item')('1.8.8')

      it('diamond axe with fortune 2', () => {
        const item = Item.fromNotch({ blockId: 279, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 2 }, id: { type: 'short', value: 35 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        const newItem = new Item(279, 1)
        newItem.enchants = enchs
        newItem.repairCost = 1
        expect(newItem).toStrictEqual(item)
      })

      it('gold helmet with fire prot 3, aqua afin 1, unbr 2', () => {
        const item = Item.fromNotch({ blockId: 314, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 1 } }, { lvl: { type: 'short', value: 2 }, id: { type: 'short', value: 34 } }, { lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 6 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
        const enchs = item.enchants
        const newItem = new Item(314, 1)
        newItem.enchants = enchs
        newItem.repairCost = 3
        expect(newItem).toStrictEqual(item)
      })

      it('carrot on stick with unbr 1', () => {
        const item = Item.fromNotch({ blockId: 398, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 34 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        const newItem = new Item(398, 1)
        newItem.enchants = enchs
        newItem.repairCost = 1
        expect(newItem).toStrictEqual(item)
      })

      it('stone pick with eff 4', () => {
        const item = Item.fromNotch({ blockId: 274, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 4 }, id: { type: 'short', value: 32 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        const newItem = new Item(274, 1)
        newItem.enchants = enchs
        newItem.repairCost = 1
        expect(newItem).toStrictEqual(item)
      })

      it('fishing rod with luck 3 lure 3', () => {
        const item = Item.fromNotch({ blockId: 346, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 61 } }, { lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 62 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
        const enchs = item.enchants
        const newItem = new Item(346, 1)
        newItem.enchants = enchs
        newItem.repairCost = 3
        expect(newItem).toStrictEqual(item)
      })
    })
    describe('1.16.5 test', () => {
      const Item = require('prismarine-item')('1.16.5')
      it('diamond sword (unenchanted)', () => {
        const item = Item.fromNotch({ present: true, itemId: 603, itemCount: 1, nbtData: { type: 'compound', name: '', value: { Damage: { type: 'int', value: 0 } } } })
        const enchs = item.enchants
        const newItem = new Item(603, 1)
        newItem.enchants = enchs
        expect(newItem).toStrictEqual(item)
      })
      it('iron shovel w/ eff2 for2 ub2', () => {
        const item = Item.fromNotch({ present: true, itemId: 600, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 3 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:efficiency' } }, { lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:fortune' } }, { lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:unbreaking' } }] } } } } })
        const enchs = item.enchants
        const newItem = new Item(600, 1)
        newItem.enchants = enchs
        newItem.repairCost = 3
        expect(newItem).toStrictEqual(item)
      })
      it('ench book w/ resp1 blastprot 1', () => {
        const item = Item.fromNotch({ present: true, itemId: 848, itemCount: 1, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:respiration' } }, { lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:blast_protection' } }] } }, RepairCost: { type: 'int', value: 1 } } } })
        const enchs = item.enchants
        const newItem = new Item(848, 1)
        newItem.enchants = enchs
        newItem.repairCost = 1
        expect(newItem).toStrictEqual(item)
      })
      it('fishing rod w/ mending', () => {
        const item = Item.fromNotch({ present: true, itemId: 684, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:mending' } }] } } } } })
        const enchs = item.enchants
        const newItem = new Item(684, 1)
        newItem.enchants = enchs
        newItem.repairCost = 1
        expect(newItem).toStrictEqual(item)
      })
    })
  })
})

describe('use Item.equal', () => {
  const Item = require('prismarine-item')('1.16.5')
  const mcData = require('minecraft-data')('1.16.5')
  it('sh5 wep + not sh5 wep', () => {
    const itemOne = new Item(mcData.itemsByName.diamond_sword.id, 1)
    itemOne.enchants = [{ name: 'sharpness', lvl: 5 }]
    const itemTwo = new Item(mcData.itemsByName.diamond_sword.id, 1)
    expect(Item.equal(itemOne, itemTwo)).toStrictEqual(false)
  })
  it('two unenchanted', () => {
    const itemOne = new Item(mcData.itemsByName.diamond_sword.id, 1)
    const itemTwo = new Item(mcData.itemsByName.diamond_sword.id, 1)
    expect(Item.equal(itemOne, itemTwo)).toStrictEqual(true)
  })
  it('two enchanted', () => {
    const itemOne = new Item(mcData.itemsByName.diamond_sword.id, 1)
    itemOne.enchants = [{ name: 'sharpness', lvl: 5 }]
    const itemTwo = new Item(mcData.itemsByName.diamond_sword.id, 1)
    itemTwo.enchants = [{ name: 'sharpness', lvl: 5 }]
    expect(Item.equal(itemOne, itemTwo)).toStrictEqual(true)
  })
  it('two enchants in common on both items but diff orders', () => {
    const itemOne = new Item(mcData.itemsByName.diamond_sword.id, 1)
    itemOne.enchants = [{ name: 'sharpness', lvl: 5 }, { name: 'unbreaking', lvl: 1 }]
    const itemTwo = new Item(mcData.itemsByName.diamond_sword.id, 1)
    itemTwo.enchants = [{ name: 'unbreaking', lvl: 1 }, { name: 'sharpness', lvl: 5 }]
    expect(Item.equal(itemOne, itemTwo)).toStrictEqual(false)
  })
})
