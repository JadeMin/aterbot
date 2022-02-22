function loader (mcData, Item) {
  function combine (itemOne, itemTwo, creative, renamedName) {
    const rename = typeof renamedName === 'string'
    const data = {
      finalEnchs: [],
      fixedDurability: 0
    }
    let onlyRename = false // to tell if its just a rename
    if (!combinePossible(itemOne, itemTwo) && itemTwo !== null) return { xpCost: 0, item: null }
    let cost = 0
    if (rename) {
      onlyRename = true
      const renameCost = getRenameCost(itemOne)
      if (renameCost === -1) return { xpCost: 0, item: null }
      cost += renameCost
    }
    if (itemOne.durabilityUsed !== 0) {
      onlyRename = false
      const { xpLevelCost: repairCost, fixedDurability, usedMats } = getRepairCost(itemOne, itemTwo)
      data.fixedDurability = fixedDurability
      data.usedMats = usedMats
      cost += repairCost
    }
    if (itemTwo && (itemTwo.name === itemOne.name || itemTwo.name === 'enchanted_book')) {
      onlyRename = false
      const { xpLevelCost: enchantCost, finalEnchs } = combineEnchants(itemOne, itemTwo, creative)
      data.finalEnchs = finalEnchs
      if (enchantCost === 0 && !rename && itemOne.metadata === 0) return { xpCost: 0, item: null } // no change
      cost += enchantCost
    }
    if (itemTwo === null && itemOne.customName === renamedName) return { xpCost: 0, item: null } // no change
    cost += itemOne.repairCost + (itemTwo?.repairCost ?? 0)

    if (cost > 39 && onlyRename) cost = 39
    else if (cost >= 40) return { xpCost: 0, item: null } // show too expensive message

    let finalItem = null
    if (itemOne) {
      finalItem = new Item(itemOne.type, itemOne.count, 0, JSON.parse(JSON.stringify(itemOne.nbt)))
      const repairCost = Math.max(itemOne.repairCost, (itemTwo?.repairCost ?? 0)) * 2 + 1
      if (data?.finalEnchs.length > 0) finalItem.enchants = data.finalEnchs
      if (rename) finalItem.customName = renamedName
      finalItem.repairCost = repairCost
      if (itemOne.name !== 'enchanted_book') finalItem.durabilityUsed = itemOne.durabilityUsed - data.fixedDurability
    }
    return { xpCost: cost, item: finalItem, usedMats: data.usedMats }
  }

  /**
   *
   * @param {Item} itemOne left hand item
   * @param {Item} itemTwo right hand item
   * @returns {xpLevelCost, finalEnchs}
   * xpLevelCost is enchant data that is strictly from combining enchants
   * finalEnchs is the array of enchants on the final object
   */
  function combineEnchants (itemOne, itemTwo, creative) {
    const rightIsBook = itemTwo.name === 'enchanted_book'
    const finalEnchs = itemOne.enchants
    const finalEnchsByName = finalEnchs.map(x => x.name)
    const itemTwoEnch = itemTwo.enchants
    let xpLevelCost = 0
    for (const ench of itemTwoEnch) {
      const enchOnItemOne = finalEnchs.find(x => x.name === ench.name)
      let { exclude, maxLevel, category, weight } = mcData.enchantmentsByName[ench.name]
      const multiplier = getMultipliers(weight, rightIsBook)
      if (!(itemOne.name === 'enchanted_book' && rightIsBook) && !mcData.itemsByName[itemOne.name].enchantCategories.includes(category) && !creative) continue
      else if (enchOnItemOne === undefined) { // first item doesn't have this ench
        exclude = exclude.map(name => mcData.enchantmentsByName[name].name)
        if (exclude.some(excludedEnch => finalEnchsByName.includes(excludedEnch))) { // has an excluded enchant
          xpLevelCost++
        } else {
          const finalLevel = ench.lvl
          xpLevelCost += finalLevel * multiplier
          finalEnchs.push({ name: ench.name, lvl: ench.lvl })
        }
      } else {
        let finalLevel = 0
        const itemOneLevel = enchOnItemOne.lvl
        const itemTwoLevel = ench.lvl
        if (itemOneLevel === itemTwoLevel) {
          finalLevel = Math.min(itemOneLevel + 1, maxLevel)
          enchOnItemOne.lvl = finalLevel
        } else if (itemTwoLevel > itemOneLevel) {
          finalLevel = itemTwoLevel
          enchOnItemOne.lvl = finalLevel
        } else if (itemOneLevel > itemTwoLevel) {
          finalLevel = itemOneLevel
        }
        xpLevelCost += finalLevel * multiplier
      }
    }
    return { xpLevelCost, finalEnchs }
  }

  // converts enchant weight to enchant cost multiplier
  function getMultipliers (weight, isBook) {
    const itemMultiplier = {
      10: 1,
      5: 2,
      2: 4,
      1: 8
    }[weight]
    return isBook ? Math.max(1, itemMultiplier / 2) : itemMultiplier
  }

  /**
   *
   * @param {Item} itemOne left hand item
   * @param {Item} itemTwo right hand item
   * @returns {xpLevelCost, fixedDurability, usedMats}
   * xpLevelCost is the number of xp levels used for repair (if any)
   * fixedDurability is duribility after using the anvil
   * usedMats is the number of materials used to fix the broken item (if many mats is used)
   */
  function getRepairCost (itemOne, itemTwo) {
    if (itemTwo === null) return { xpLevelCost: 0, fixedDurability: 0, usedMats: 0 } // air
    else if (itemTwo.name === 'enchanted_book') return { xpLevelCost: 0, fixedDurability: 0, usedMats: 0 }

    const maxDurability = mcData.itemsByName[itemOne.name].maxDurability
    const durabilityLost = itemOne.durabilityUsed
    const fixMaterials = mcData.itemsByName[itemOne.name].repairWith.concat([itemOne.name])
    if (!fixMaterials.includes(itemTwo.name) && itemOne.name !== itemTwo.name) {
      return 0 // Enchanted book can't fix
    }
    let results = {
      fixedDurability: 0,
      xpLevelCost: 0,
      usedMats: 0
    }
    if (itemTwo.name === itemOne.name) {
      const possibleFixedDura = Math.floor(0.12 * maxDurability) + itemTwo.metadata
      results = {
        fixedDurability: itemOne.metadata < possibleFixedDura ? itemOne.durabilityUsed : possibleFixedDura,
        xpLevelCost: 2,
        usedMats: 1
      }
    } else if (durabilityLost !== 0) {
      const durabilityFixedPerMat = Math.floor(maxDurability * 0.25)
      const matsToFullyRepair = Math.ceil(durabilityLost / durabilityFixedPerMat)
      if (itemTwo.count > matsToFullyRepair) { // takeall of itemTwo
        results = {
          fixedDurability: maxDurability - itemOne.durabilityUsed,
          xpLevelCost: matsToFullyRepair, // 1 exp lvl per mat used
          usedMats: matsToFullyRepair
        }
      } else if (itemOne && itemTwo) {
        results = {
          fixedDurability: Math.min(itemOne.durabilityUsed, durabilityFixedPerMat * itemTwo.count),
          xpLevelCost: itemTwo.count, // 1 exp lvl per mat used
          usedMats: itemTwo.count
        }
      }
    }
    return results
  }

  function getRenameCost (item) {
    if (item?.nbt?.value?.RepairCost?.value === 0x7fffffff) return -1
    return 1
  }

  function combinePossible (itemOne, itemTwo) {
    if (!itemOne?.name || !itemTwo?.name || (!itemOne?.name && !itemTwo?.name)) return false
    let fixMaterials = (mcData.itemsByName[itemOne.name].repairWith ?? []).concat([itemOne.name])
    if (itemOne.name !== 'enchanted_book') fixMaterials = fixMaterials.concat(['enchanted_book'])
    return fixMaterials.includes(itemTwo.name)
  }

  return combine
}

module.exports = loader
