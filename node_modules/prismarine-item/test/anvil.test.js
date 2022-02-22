/* eslint-env mocha */

const expect = require('expect')

describe('1.8.9 anvil', () => {
  const Item = require('prismarine-item')('1.8.8')
  it('combine two damaged sword', () => {
    const sword1 = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 5, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 34 } }] } }, RepairCost: { type: 'int', value: 1 } } } })
    const sword2 = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 3 })
    const res = Item.anvil(sword1, sword2, false, undefined)
    const inverse = Item.anvil(sword2, sword1, false, undefined)
    const finalItem = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 34 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
    const inverseFinalItem = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 34 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
    expect(res.xpCost).toStrictEqual(3)
    expect(inverse.xpCost).toStrictEqual(5)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })
  it('combine two books', () => {
    const book1 = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 48 } }] } } } } })
    const book2 = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 6 } }] } } } } })
    const finalItem = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 48 } }, { lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 6 } }] } } } } })
    const inverseFinalItem = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 6 } }, { lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 48 } }] } } } } })
    const res = Item.anvil(book1, book2, false, undefined)
    const inverse = Item.anvil(book2, book1, false, undefined)
    expect(res.xpCost).toStrictEqual(2)
    expect(inverse.xpCost).toStrictEqual(5)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  it('combine book that has repairCost', () => {
    const sword = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 3 })
    const book = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 48 } }, { lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 16 } }] } } } } })
    const res = Item.anvil(sword, book, false, undefined)
    const inverse = Item.anvil(book, sword, false, undefined)
    const finalItem = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 3, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 16 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
    const inverseFinalItem = null
    expect(res.xpCost).toStrictEqual(6)
    expect(inverse.xpCost).toStrictEqual(0)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  it('combine book (with incompatible enchants) using creative', () => {
    const sword = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 3 })
    const book = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 48 } }, { lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 16 } }] } } } } })
    const res = Item.anvil(sword, book, true, undefined)
    const inverse = Item.anvil(book, sword, true, undefined)
    const finalItem = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 3, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 48 } }, { lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 16 } }] } }, RepairCost: { type: 'int', value: 3 } } } })
    const inverseFinalItem = null
    expect(res.xpCost).toStrictEqual(11)
    expect(inverse.xpCost).toStrictEqual(0)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  it('diamond sword rename', () => {
    const item = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0 })
    const res = Item.anvil(item, null, false, 'ababa')
    const inverse = Item.anvil(null, item, false, 'ababa')
    const finalItem = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'ababa' } } } } } })
    const inverseFinalItem = null
    expect(res.xpCost).toStrictEqual(1)
    expect(inverse.xpCost).toStrictEqual(0)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  it('rename to same name as before', () => {
    const item = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'ababa' } } } } } })
    const res = Item.anvil(item, null, false, 'ababa')
    expect(res.xpCost).toStrictEqual(0)
    expect(res.item).toStrictEqual(null)
  })

  it('enchanted book rename', () => {
    const item = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 3 } }] } } } } })
    const res = Item.anvil(item, null, false, 'ababa')
    const inverse = Item.anvil(null, item, false, 'ababa')
    const finalItem = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'ababa' } } }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 3 } }] } } } } })
    const inverseFinalItem = null
    expect(res.xpCost).toStrictEqual(1)
    expect(inverse.xpCost).toStrictEqual(0)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  it('(64x) blocks rename', () => {
    const item = Item.fromNotch({ blockId: 1, itemCount: 64, itemDamage: 0 })
    const res = Item.anvil(item, null, false, 'ababa')
    const inverse = Item.anvil(null, item, false, 'ababa')
    const finalItem = Item.fromNotch({ blockId: 1, itemCount: 64, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'ababa' } } } } } })
    const inverseFinalItem = null
    expect(res.xpCost).toStrictEqual(1)
    expect(inverse.xpCost).toStrictEqual(0)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  it('combine w/ pre-rename', () => {
    const itemOne = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'Diamond Sword1212' } } } } } })
    const itemTwo = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 48 } }, { lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 16 } }] } } } } })
    const finalItem = Item.fromNotch({ blockId: 276, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { ench: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'short', value: 16 } }] } }, RepairCost: { type: 'int', value: 3 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'Diamond Sword1212' } } } } } })
    const inverseFinalItem = null
    const res = Item.anvil(itemOne, itemTwo, false, undefined)
    const inverse = Item.anvil(itemTwo, itemOne, false, undefined)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  it('incompatible books', () => {
    const itemOne = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 33 } }] } } } } })
    const itemTwo = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 34 } }, { lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 35 } }] } } } } })
    const inverseFinalItem = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 3 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 34 } }, { lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 35 } }] } } } } })
    const finalItem = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 3 }, StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 1 }, id: { type: 'short', value: 33 } }, { lvl: { type: 'short', value: 3 }, id: { type: 'short', value: 34 } }] } } } } })
    const res = Item.anvil(itemOne, itemTwo, false, undefined)
    const inverse = Item.anvil(itemTwo, itemOne, false, undefined)
    expect(res.item).toStrictEqual(finalItem)
    expect(inverse.item).toStrictEqual(inverseFinalItem)
  })

  describe('too expensive test', () => {
    const chestplate = Item.fromNotch({ blockId: 303, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 63 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'Chain Chaestaaplateaaa' } } } } } })
    it('try renaming', () => {
      const res = Item.anvil(chestplate, null, false, 'Hello!')
      const expectedItem = Item.fromNotch({ blockId: 303, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 127 }, display: { type: 'compound', value: { Name: { type: 'string', value: 'Hello!' } } } } } })
      expect(res.xpCost).toStrictEqual(39)
      expect(res.item).toStrictEqual(expectedItem)
    })
    it('try adding enchants', () => {
      const secondItem = Item.fromNotch({ blockId: 403, itemCount: 1, itemDamage: 0, nbtData: { type: 'compound', name: '', value: { StoredEnchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 4 }, id: { type: 'short', value: 0 } }] } } } } })
      const res = Item.anvil(chestplate, secondItem, false, 'Hello!')
      expect(res.item).toStrictEqual(null)
    })
  })
})

describe('1.16.5 anvil', () => {
  const Item = require('prismarine-item')('1.16.5')
  const mcData = require('minecraft-data')('1.16.5')

  function makeBook (ench, repairCost) {
    const i = new Item(mcData.itemsByName.enchanted_book.id, 1)
    i.enchants = ench
    if (repairCost > 0) i.repairCost = repairCost
    return i
  }

  function expectAnvilEq (res, cost, item) {
    expect(res.xpCost).toStrictEqual(cost)
    expect(res.item).toStrictEqual(item)
  }

  it('gold helmets', () => {
    const firstItem = Item.fromNotch({ present: true, itemId: 638, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 3 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'string', value: 'minecraft:fire_protection' } }, { lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:unbreaking' } }, { lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:aqua_affinity' } }] } } } } })
    const seconditem = Item.fromNotch({ present: true, itemId: 638, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 3 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 2 }, id: { type: 'string', value: 'minecraft:unbreaking' } }, { lvl: { type: 'short', value: 4 }, id: { type: 'string', value: 'minecraft:projectile_protection' } }, { lvl: { type: 'short', value: 3 }, id: { type: 'string', value: 'minecraft:respiration' } }] } } } } })
    const anvil = Item.anvil(firstItem, seconditem, false, undefined)
    const expectedItem = Item.fromNotch({ present: true, itemId: 638, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 7 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'string', value: 'minecraft:fire_protection' } }, { lvl: { type: 'short', value: 3 }, id: { type: 'string', value: 'minecraft:unbreaking' } }, { lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:aqua_affinity' } }, { lvl: { type: 'short', value: 3 }, id: { type: 'string', value: 'minecraft:respiration' } }] } } } } })
    const inverse = Item.anvil(seconditem, firstItem, false, undefined)
    const expectedInverseItem = Item.fromNotch({ present: true, itemId: 638, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 7 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 3 }, id: { type: 'string', value: 'minecraft:unbreaking' } }, { lvl: { type: 'short', value: 4 }, id: { type: 'string', value: 'minecraft:projectile_protection' } }, { lvl: { type: 'short', value: 3 }, id: { type: 'string', value: 'minecraft:respiration' } }, { lvl: { type: 'short', value: 1 }, id: { type: 'string', value: 'minecraft:aqua_affinity' } }] } } } } })
    expect(anvil.item).toStrictEqual(expectedItem)
    expect(inverse.item).toStrictEqual(expectedInverseItem)
  })

  it('two fully fixed diamond swords', () => {
    const firstItem = Item.fromNotch({ present: true, itemId: 603, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'string', value: 'minecraft:sharpness' } }] } } } } })
    const secondItem = Item.fromNotch({ present: true, itemId: 603, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 1 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'string', value: 'minecraft:sharpness' } }] } } } } })
    const anvil = Item.anvil(firstItem, secondItem, false, undefined)
    const resItem = Item.fromNotch({ present: true, itemId: 603, itemCount: 1, nbtData: { type: 'compound', name: '', value: { RepairCost: { type: 'int', value: 3 }, Damage: { type: 'int', value: 0 }, Enchantments: { type: 'list', value: { type: 'compound', value: [{ lvl: { type: 'short', value: 5 }, id: { type: 'string', value: 'minecraft:sharpness' } }] } } } } })
    expect(anvil.item).toStrictEqual(resItem)
    expect(anvil.xpCost).toStrictEqual(7)
  })

  it('fixing iron sword with iron ingots', () => {
    const firstItem = Item.fromNotch({ present: true, itemId: 598, itemCount: 1, nbtData: { type: 'compound', name: '', value: { Damage: { type: 'int', value: 300 } } } })
    const secondItem = Item.fromNotch({ present: true, itemId: 579, itemCount: 2 })
    const anvil = Item.anvil(firstItem, secondItem, false, undefined)
    const expectedItem = Item.fromNotch({ present: true, itemId: 598, itemCount: 1, nbtData: { type: 'compound', name: '', value: { Damage: { type: 'int', value: 176 }, RepairCost: { type: 'int', value: 1 } } } })
    expect(anvil.item).toStrictEqual(expectedItem)
    expect(anvil.xpCost).toStrictEqual(2)
    expect(anvil.usedMats).toStrictEqual(2)
  })
  it('fixing iron sword with enchanted iron ingots', () => {
    const firstItem = Item.fromNotch({ present: true, itemId: 598, itemCount: 1, nbtData: { type: 'compound', name: '', value: { Damage: { type: 'int', value: 300 } } } })
    const secondItem = Item.fromNotch({ present: true, itemId: 579, itemCount: 2, nbtData: { name: '', type: 'compound', value: { Enchantments: { type: 'list', value: { type: 'compound', value: [{ id: { type: 'string', value: 'minecraft:unbreaking' }, lvl: { type: 'short', value: 2 } }] } } } } })
    const anvil = Item.anvil(firstItem, secondItem, false, undefined)
    const expectedItem = Item.fromNotch({ present: true, itemId: 598, itemCount: 1, nbtData: { type: 'compound', name: '', value: { Damage: { type: 'int', value: 176 }, RepairCost: { type: 'int', value: 1 } } } })
    expect(anvil.item).toStrictEqual(expectedItem)
    expect(anvil.xpCost).toStrictEqual(2)
    expect(anvil.usedMats).toStrictEqual(2)
  })

  describe('test fixing with items', () => {
    for (let i = 1; i <= 5; i++) {
      it(`fix using ${i} ingots`, () => {
        const firstItem = Item.fromNotch({ present: true, itemId: 598, itemCount: 1, nbtData: { type: 'compound', name: '', value: { Damage: { type: 'int', value: 300 } } } })
        const secondItem = Item.fromNotch({ present: true, itemId: 579, itemCount: i })
        const anvil = Item.anvil(firstItem, secondItem, false, undefined)
        expect(anvil.xpCost).toStrictEqual(i)
        expect(anvil.usedMats).toStrictEqual(i)
      })
    }
  })
  describe('wiki related', () => {
    describe('wiki tests', () => { // this example is assumed to have no repair cost on either item (so they are assumed to be found with the enchants)
      it('Dealing with equal enchantments', () => {
        const itemOne = new Item(598, 1)
        itemOne.enchants = [{ name: 'sharpness', lvl: 3 }, { name: 'knockback', lvl: 2 }, { name: 'looting', lvl: 3 }]
        const itemTwo = new Item(598, 1)
        itemTwo.enchants = [{ name: 'sharpness', lvl: 3 }, { name: 'looting', lvl: 3 }]
        // expected way
        const expectedItem = new Item(598, 1)
        expectedItem.enchants = [{ name: 'sharpness', lvl: 4 }, { name: 'knockback', lvl: 2 }, { name: 'looting', lvl: 3 }]
        expectedItem.repairCost = 1
        const anvilResults = Item.anvil(itemOne, itemTwo, false, undefined)
        expect(anvilResults.item).toStrictEqual(expectedItem)
        expect(anvilResults.xpCost).toStrictEqual(16)
        // inverse
        const inverseAnvilResults = Item.anvil(itemTwo, itemOne, false, undefined)
        const inverseExpectedItem = new Item(598, 1)
        inverseExpectedItem.enchants = [{ name: 'sharpness', lvl: 4 }, { name: 'looting', lvl: 3 }, { name: 'knockback', lvl: 2 }]
        inverseExpectedItem.repairCost = 1
        expect(inverseAnvilResults.item).toStrictEqual(inverseExpectedItem)
        expect(inverseAnvilResults.xpCost).toStrictEqual(20)
      })
      it('Dealing with unequal enchantments', () => {
        const itemOne = new Item(598, 1)
        itemOne.enchants = [{ name: 'sharpness', lvl: 3 }, { name: 'knockback', lvl: 2 }, { name: 'looting', lvl: 1 }]
        const itemTwo = new Item(598, 1)
        itemTwo.enchants = [{ name: 'sharpness', lvl: 1 }, { name: 'looting', lvl: 3 }]
        // expected way
        const expectedItem = new Item(598, 1)
        expectedItem.enchants = [{ name: 'sharpness', lvl: 3 }, { name: 'knockback', lvl: 2 }, { name: 'looting', lvl: 3 }]
        expectedItem.repairCost = 1
        const anvilResults = Item.anvil(itemOne, itemTwo, false, undefined)
        expect(anvilResults.item).toStrictEqual(expectedItem)
        expect(anvilResults.xpCost).toStrictEqual(15)
        // inverse
        const inverseAnvilResults = Item.anvil(itemTwo, itemOne, false, undefined)
        const inverseExpectedItem = new Item(598, 1)
        inverseExpectedItem.enchants = [{ name: 'sharpness', lvl: 3 }, { name: 'looting', lvl: 3 }, { name: 'knockback', lvl: 2 }]
        inverseExpectedItem.repairCost = 1
        expect(inverseAnvilResults.item).toStrictEqual(inverseExpectedItem)
        expect(inverseAnvilResults.xpCost).toStrictEqual(19)
      })
      it('Dealing with conflicting enchantments', () => {
        const itemOne = new Item(598, 1)
        itemOne.enchants = [{ name: 'sharpness', lvl: 2 }, { name: 'looting', lvl: 2 }]
        const itemTwo = new Item(598, 1)
        itemTwo.enchants = [{ name: 'smite', lvl: 5 }, { name: 'looting', lvl: 2 }]
        // expected way
        const expectedItem = new Item(598, 1)
        expectedItem.enchants = [{ name: 'sharpness', lvl: 2 }, { name: 'looting', lvl: 3 }]
        expectedItem.repairCost = 1
        const anvilResults = Item.anvil(itemOne, itemTwo, false, undefined)
        expect(anvilResults.item).toStrictEqual(expectedItem)
        expect(anvilResults.xpCost).toStrictEqual(13)
        // inverse
        const inverseAnvilResults = Item.anvil(itemTwo, itemOne, false, undefined)
        const inverseExpectedItem = new Item(598, 1)
        inverseExpectedItem.enchants = [{ name: 'smite', lvl: 5 }, { name: 'looting', lvl: 3 }]
        inverseExpectedItem.repairCost = 1
        expect(inverseAnvilResults.item).toStrictEqual(inverseExpectedItem)
        expect(inverseAnvilResults.xpCost).toStrictEqual(13)
      })
      it('Using books', () => {
        const itemOne = new Item(598, 1)
        itemOne.enchants = [{ name: 'looting', lvl: 2 }]
        const itemTwo = new Item(848, 1)
        itemTwo.enchants = [{ name: 'protection', lvl: 3 }, { name: 'sharpness', lvl: 1 }, { name: 'looting', lvl: 2 }]
        // expected way
        const expectedItem = new Item(598, 1)
        expectedItem.enchants = [{ name: 'looting', lvl: 3 }, { name: 'sharpness', lvl: 1 }]
        expectedItem.repairCost = 1
        const anvilResults = Item.anvil(itemOne, itemTwo, false, undefined)
        expect(anvilResults.item).toStrictEqual(expectedItem)
        expect(anvilResults.xpCost).toStrictEqual(7)
      })
    })
    describe('Enchantment Order Diagram', () => { // this test is from https://minecraft.gamepedia.com/File:Enchantment_Order_Diagram.png
      // make items
      let b1, b2, b3, b4, c1, c2
      const a1 = new Item(mcData.itemsByName.diamond_boots.id, 1)
      const a2 = makeBook([{ name: 'soul_speed', lvl: 3 }], 0)
      const a3 = makeBook([{ name: 'thorns', lvl: 3 }], 0)
      const a4 = makeBook([{ name: 'feather_falling', lvl: 4 }], 0)
      const a5 = makeBook([{ name: 'depth_strider', lvl: 3 }], 0)
      const a6 = makeBook([{ name: 'protection', lvl: 4 }], 0)
      const a7 = makeBook([{ name: 'unbreaking', lvl: 3 }], 0)
      const a8 = makeBook([{ name: 'mending', lvl: 1 }], 0)
      describe('first combine', () => {
        it('enchant boot+ss3', () => {
          const eqItem = new Item(mcData.itemsByName.diamond_boots.id, 1)
          eqItem.enchants = [{ name: 'soul_speed', lvl: 3 }]
          eqItem.repairCost = 1
          const res = Item.anvil(a1, a2, false, undefined)
          expectAnvilEq(res, 12, eqItem)
          b1 = res.item
        })
        it('thorns3+ff4', () => {
          const eqItem = makeBook([{ name: 'thorns', lvl: 3 }, { name: 'feather_falling', lvl: 4 }], 1)
          const res = Item.anvil(a3, a4, false, undefined)
          expectAnvilEq(res, 4, eqItem)
          b2 = res.item
        })
        it('depth3+p4', () => {
          const eqItem = makeBook([{ name: 'depth_strider', lvl: 3 }, { name: 'protection', lvl: 4 }], 1)
          const res = Item.anvil(a5, a6, false, undefined)
          expectAnvilEq(res, 4, eqItem)
          b3 = res.item
        })
        it('ub3+mending', () => {
          const eqItem = makeBook([{ name: 'unbreaking', lvl: 3 }, { name: 'mending', lvl: 1 }], 1)
          const res = Item.anvil(a7, a8, false, undefined)
          expectAnvilEq(res, 2, eqItem)
          b4 = res.item
        })
      })
      describe('second combine', () => {
        it('ss3 boots + t3 ff4', () => {
          const eqItem = new Item(mcData.itemsByName.diamond_boots.id, 1)
          eqItem.enchants = [{ name: 'soul_speed', lvl: 3 }, { name: 'thorns', lvl: 3 }, { name: 'feather_falling', lvl: 4 }]
          eqItem.repairCost = 3
          const res = Item.anvil(b1, b2, false, undefined)
          expectAnvilEq(res, 16 + 2, eqItem) // 1 working per item
          c1 = res.item
        })
        it('d3p4 + u3m1', () => {
          const eqItem = makeBook([{ name: 'depth_strider', lvl: 3 }, { name: 'protection', lvl: 4 }, { name: 'unbreaking', lvl: 3 }, { name: 'mending', lvl: 1 }], 3)
          const res = Item.anvil(b3, b4, false, undefined)
          expectAnvilEq(res, 5 + 2, eqItem) // 1 working on each book
          c2 = res.item
        })
      })
      describe('third combine', () => {
        it('d3p4 + u3m1', () => {
          const eqItem = new Item(mcData.itemsByName.diamond_boots.id, 1)
          eqItem.enchants = [{ name: 'soul_speed', lvl: 3 }, { name: 'thorns', lvl: 3 }, { name: 'feather_falling', lvl: 4 }, { name: 'depth_strider', lvl: 3 }, { name: 'protection', lvl: 4 }, { name: 'unbreaking', lvl: 3 }, { name: 'mending', lvl: 1 }]
          eqItem.repairCost = 7
          const res = Item.anvil(c1, c2, false, undefined)
          expectAnvilEq(res, 15 + 6, eqItem) // 3 lvl repairCost on each item
        })
      })
    })
  })
})
