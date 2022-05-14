const nbt = require('prismarine-nbt')
function loader (version) {
  const mcData = require('minecraft-data')(version)
  class Item {
    constructor (type, count, metadata, nbt) {
      if (type == null) return

      if (metadata instanceof Object && metadata !== null) {
        nbt = metadata
        metadata = 0
      }

      this.type = type
      this.count = count
      this.metadata = metadata == null ? 0 : metadata
      this.nbt = nbt || null

      const itemEnum = mcData.items[type]
      if (itemEnum) {
        this.name = itemEnum.name
        this.displayName = itemEnum.displayName
        if ('variations' in itemEnum) {
          for (const i in itemEnum.variations) {
            if (itemEnum.variations[i].metadata === metadata) { this.displayName = itemEnum.variations[i].displayName }
          }
        }
        this.stackSize = itemEnum.stackSize
      } else {
        this.name = 'unknown'
        this.displayName = 'unknown'
        this.stackSize = 1
      }
    }

    static equal (item1, item2, matchStackSize = true) {
      if (item1 == null && item2 == null) {
        return true
      } else if (item1 == null) {
        return false
      } else if (item2 == null) {
        return false
      } else {
        return (item1.type === item2.type &&
            (matchStackSize ? item1.count === item2.count : true) &&
            item1.metadata === item2.metadata &&
            JSON.stringify(item1.nbt) === JSON.stringify(item2.nbt))
      }
    }

    static toNotch (item) {
      if (mcData.supportFeature('itemSerializationAllowsPresent')) {
        if (item == null) return { present: false }
        const notchItem = {
          present: true,
          itemId: item.type,
          itemCount: item.count
        }
        if (item.nbt && item.nbt.length !== 0) { notchItem.nbtData = item.nbt }
        return notchItem
      } else if (mcData.supportFeature('itemSerializationUsesBlockId')) {
        if (item == null) return { blockId: -1 }
        const notchItem = {
          blockId: item.type,
          itemCount: item.count,
          itemDamage: item.metadata
        }
        if (item.nbt && item.nbt.length !== 0) { notchItem.nbtData = item.nbt }
        return notchItem
      }
      throw new Error("Don't know how to serialize for this mc version ")
    }

    static fromNotch (item) {
      if (mcData.supportFeature('itemSerializationWillOnlyUsePresent')) {
        if (item.present === false) return null
        return new Item(item.itemId, item.itemCount, item.nbtData)
      } else if (mcData.supportFeature('itemSerializationAllowsPresent')) {
        if (item.itemId === -1 || item.present === false) return null
        return new Item(item.itemId, item.itemCount, item.nbtData)
      } else if (mcData.supportFeature('itemSerializationUsesBlockId')) {
        if (item.blockId === -1) return null
        return new Item(item.blockId, item.itemCount, item.itemDamage, item.nbtData)
      }
      throw new Error("Don't know how to deserialize for this mc version ")
    }

    get customName () {
      if (Object.keys(this).length === 0) return null
      return this?.nbt?.value?.display?.value?.Name?.value ?? null
    }

    set customName (newName) {
      if (!this.nbt) this.nbt = { name: '', type: 'compound', value: {} }
      if (!this.nbt.value.display) this.nbt.value.display = { type: 'compound', value: {} }
      this.nbt.value.display.value.Name = { type: 'string', value: newName }
    }

    get customLore () {
      if (Object.keys(this).length === 0) return null
      return this?.nbt?.value?.display?.value?.Lore?.value.value ?? null
    }

    set customLore (newLore) {
      if (!this.nbt) this.nbt = { name: '', type: 'compound', value: {} }
      if (!this.nbt.value.display) this.nbt.value.display = { type: 'compound', value: {} }
      this.nbt.value.display.value.Lore = { type: 'string', value: newLore }
    }

    // gets the cost based on previous anvil uses
    get repairCost () {
      if (Object.keys(this).length === 0) return 0
      return this?.nbt?.value?.RepairCost?.value ?? 0
    }

    set repairCost (value) {
      if (!this?.nbt) this.nbt = { name: '', type: 'compound', value: {} }
      this.nbt.value.RepairCost = { type: 'int', value }
    }

    get enchants () {
      if (Object.keys(this).length === 0) return []
      const enchantNbtKey = mcData.supportFeature('nbtNameForEnchant')
      const typeOfEnchantLevelValue = mcData.supportFeature('typeOfValueForEnchantLevel')
      if (typeOfEnchantLevelValue === 'short' && enchantNbtKey === 'ench') {
        let itemEnch
        if (this.name === 'enchanted_book' && this?.nbt?.value?.StoredEnchantments) {
          itemEnch = nbt.simplify(this.nbt).StoredEnchantments
        } else if (this?.nbt?.value?.ench) {
          itemEnch = nbt.simplify(this.nbt).ench
        } else {
          itemEnch = []
        }
        return itemEnch.map(ench => ({ lvl: ench.lvl, name: mcData.enchantments[ench.id]?.name || null }))
      } else if (typeOfEnchantLevelValue === 'string' && enchantNbtKey === 'Enchantments') {
        let itemEnch = []
        if (this?.nbt?.value?.Enchantments) {
          itemEnch = nbt.simplify(this.nbt).Enchantments
        } else if (this?.nbt?.value?.StoredEnchantments) {
          itemEnch = nbt.simplify(this.nbt).StoredEnchantments
        } else {
          itemEnch = []
        }
        return itemEnch.map(ench => ({ lvl: ench.lvl, name: typeof ench.id === 'string' ? ench.id.replace(/minecraft:/, '') : null }))
      }
      throw new Error("Don't know how to get the enchants from an item on this mc version")
    }

    set enchants (normalizedEnchArray) {
      const isBook = this.name === 'enchanted_book'
      const enchListName = mcData.supportFeature('nbtNameForEnchant')
      const type = mcData.supportFeature('typeOfValueForEnchantLevel')
      if (type === null) throw new Error("Don't know the serialized type for enchant level")
      if (!this.nbt) this.nbt = { name: '', type: 'compound', value: {} }

      const enchs = normalizedEnchArray.map(({ name, lvl }) => {
        const value = type === 'short' ? mcData.enchantmentsByName[name].id : `minecraft:${mcData.enchantmentsByName[name].name}`
        return { id: { type, value }, lvl: { type: 'short', value: lvl } }
      })

      if (enchs.length !== 0) {
        this.nbt.value[isBook ? 'StoredEnchantments' : enchListName] = { type: 'list', value: { type: 'compound', value: enchs } }
      }

      // The 'mcData.itemsByName[this.name].maxDurability' checks to see if this item can lose durability
      if (mcData.supportFeature('whereDurabilityIsSerialized') === 'Damage' && mcData.itemsByName[this.name].maxDurability) {
        this.nbt.value.Damage = { type: 'int', value: 0 }
      }
    }

    get durabilityUsed () {
      if (Object.keys(this).length === 0) return null
      const where = mcData.supportFeature('whereDurabilityIsSerialized')
      if (where === 'Damage') {
        return this?.nbt?.value?.Damage?.value ?? 0
      } else if (where === 'metadata') {
        return this.metadata ?? 0
      }
      throw new Error("Don't know how to get item durability for this mc version")
    }

    set durabilityUsed (value) {
      const where = mcData.supportFeature('whereDurabilityIsSerialized')
      if (where === 'Damage') {
        if (!this?.nbt) this.nbt = { name: '', type: 'compound', value: {} }
        this.nbt.value.Damage = { type: 'int', value }
      } else if (where === 'metadata') {
        this.metadata = value
      } else {
        throw new Error("Don't know how to set item durability for this mc version")
      }
    }

    get spawnEggMobName () {
      if (mcData.supportFeature('spawnEggsUseInternalIdInNbt')) {
        return mcData.entitiesArray.find(o => o.internalId === this.metadata).name
      }
      if (mcData.supportFeature('spawnEggsUseEntityTagInNbt')) {
        const data = nbt.simplify(this.nbt)
        const entityName = data.EntityTag.id
        return entityName.replace('minecraft:', '')
      }
      if (mcData.supportFeature('spawnEggsHaveSpawnedEntityInName')) {
        return this.name.replace('_spawn_egg', '')
      }
      throw new Error("Don't know how to get spawn egg mob name for this mc version")
    }
  }

  Item.anvil = require('./lib/anvil.js')(mcData, Item)
  return Item
}

module.exports = loader
