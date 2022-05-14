# prismarine-item
[![NPM version](https://img.shields.io/npm/v/prismarine-item.svg)](http://npmjs.com/package/prismarine-item)
[![Build Status](https://github.com/PrismarineJS/prismarine-item/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-item/actions?query=workflow%3A%22CI%22)

Represent a minecraft item with its associated data

## Usage

```js
const Item = require('prismarine-item')('1.8')

const ironShovelItem = new Item(256, 1)
console.log(ironShovelItem)

const notchItem = Item.toNotch(ironShovelItem)
console.log(notchItem)
console.log(Item.fromNotch(notchItem))
```

## API

### Item(type, count[, metadata], nbt)

#### Item.toNotch(item)

Take an `item` in the format of the minecraft packets and return an `Item` instance.

#### Item.fromNotch(item)

Take an `Item` instance and return it in the format of the minecraft packets.

### Item.anvil(itemOne, itemTwo, creative[, newName])

Take two seperate `item` instances, and makes one item using the same combining done by the vanilla anvil

### Item.equal(itemOne, itemTwo[, matchStackSize])

`itemOne` - first item

`itemTwo` - second item

`matchStackSize` - whether to check for count equality

Checks equality between two items based on itemType, count, metadata, and stringified nbt

#### item.type

Numerical id.

#### item.count

#### item.metadata

Number which represents different things depending on the item.
See http://www.minecraftwiki.net/wiki/Data_values#Data

#### item.nbt

Buffer.

#### item.name

#### item.displayName

#### item.stackSize

#### item.equal(otherItem)

Return true if items are equal.

#### item.durabilityUsed

A getter/setter for abstracting the underlying nbt

#### item.customName

the item's custom name (ie. anvil name)

#### item.customLore

the item's custom lore (ie. set in give command)

#### item.enchants

A getter/setter for abstracting the underlying nbt (does calculations) 

#### item.repairCost

A getter/setter for abstracting the underlying nbt.
See https://minecraft.gamepedia.com/Anvil_mechanics#Anvil_Uses

#### item.spawnEggMobName

A getter for abstracting the underlying nbt, get's the mob name from a spawn egg Item. e.g. a zombie spawn egg on 1.8 will return `Zombie`


## History

## 1.11.5

* Update mcdata

## 1.11.4

* Use mcData.items instead of mcData.findItemOrBlockById()

## 1.11.3

* Use supportFeature from mcdata

## 1.11.2

* Add checks for enchantment name retrieval (#53) @firejoust
* Bump prismarine-nbt from 1.6.0 to 2.0.0 (#49)

## 1.11.1

* fix customLore

## 1.11.0

* fix typings
* add .customLore
* .customName now returns null when there is no custom name

## 1.10.1

* update typings (thanks @stzups)

## 1.10.0

* add item.spawnEggMobName (thanks @U9G)

## 1.9.1

* fix item present detection (thanks @U9G)

## 1.9.0

* Revise typings (thanks @extremeheat)
* Revise deps (thanks @rom1504)
* Correctly identify null items in MC 1.13 (thanks @u9g)

## 1.8.0

* add matchStackSize option on Item.equal (thanks @u9g)

## 1.7.0

* Item.equal checks nbt equality (thanks @u9g)

## 1.6.0

* Item.anvil added, along with a ton of getters & setters for Item (thanks @u9g)

### 1.5.0

* 1.16 support (thanks @DrakoTrogdor)

### 1.4.0

* typescripts definitions (thanks @IdanHo)

### 1.3.0

* 1.15 support

### 1.2.0

* 1.14 support

### 1.1.1

* allow unknown items

### 1.1.0

* 1.13 support

### 1.0.2

* make nbt default to null
* display the item id if it is not found in minecraft data

### 1.0.1

* bump mcdata

### 1.0.0

* bump dependencies

### 0.0.0

* Import from mineflayer
