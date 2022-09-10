# API

Import the module:

```js
const minecraftData = require('minecraft-data')

const mcData = minecraftData('1.19')
```

or using es6 import syntax:

```js
import minecraftData from 'minecraft-data'

const mcData = minecraftData('1.19')
```

All examples reference `minecraftData` as the module, and `mcData` as the version data.

## Blocks

### mcData.blocks

Blocks indexed by id

Example:

```js
console.log(mcData.blocks[1]) // Object containing information for "Stone"
```

### mcData.blocksByName

Blocks indexed by name

Example:

```js
console.log(mcData.blocksByName['stone']) // Object containing information for "Stone"
```

### mcData.blocksArray

Array of blocks

### mcData.blocksByStateId

Blocks indexed by state id

Example:

```js
console.log(mcData.blocksByStateId[100]) // Object containing information for "Lava" (as Lava has a state range from 91 to 106)
```

### mcData.blockStates

**_Bedrock edition only_**

Array of block states

Example:

```js
console.log(mcData.blockStates[50]) // Object containing block state information for "Warped Door"
```

### mcData.blockCollisionShapes

Block collision shapes. Contains `blocks`, with each block (indexed by name) containing an array of collision shape ids. Also contains `shapes`, providing all collision shapes information (indexed by id).

Example:

```js
console.log(mcData.blockCollisionShapes.blocks['oak_stairs']) // Array of collision shape ids for "Oak Stairs"
// Returns: [ 42, 32, 43, 33, 37, 27, 38, 28 ]

console.log(mcData.blockCollisionShapes.shapes[42]) // Collision information for collision shape id 42
// Returns: [ [ 0, 0, 0, 1, 0.5, 1 ], [ 0.5, 0.5, 0.5, 1, 1, 1 ] ]
```

## Items

### mcData.items

Items indexed by id

Example:

```js
console.log(mcData.items[772]) // Object containing information for "Wheat"
```

### mcData.itemsByName

Items indexed by name

Example:

```js
console.log(mcData.itemsByName['wheat']) // Object containing information for "Wheat"
```

### mcData.itemsArray

Array of items

## Foods

### mcData.foods

Foods indexed by id

Example:

```js
console.log(mcData.foods[1003]) // Object containing information for "Pumpkin Pie"
```

### mcData.foodsByName

Foods indexed by name

Example:

```js
console.log(mcData.foodsByName['pumpkin_pie']) // Object containing information for "Pumpkin Pie"
```

### mcData.foodsArray

Array of foods

## Biomes

### mcData.biomes

Biomes indexed by id

Example:

```js
console.log(mcData.biomes[20]) // Object containing information for "Windswept Gravelly Hills"
```

### mcData.biomesByName

Biomes indexed by name

Example:

```js
console.log(mcData.biomesByName['windswept_gravelly_hills']) // Object containing information for "Windswept Gravelly Hills"
```

### mcData.biomesArray

Array of biomes

## Recipes

### mcData.recipes

Recipes indexed by the resulting item id

Example:

```js
console.log(mcData.recipes[31]) // Recipe information for crafting "Dripstone Block"

// Returns:
// {
//   inShape: [ [ 1100, 1100 ], [ 1100, 1100 ] ],
//   result: { count: 1, id: 13 }
// }

// Note: 1100 is the block ID of "Pointed Dripstone"
```

## Instruments

### mcData.instruments

Instruments indexed by id

Example:

```js
console.log(mcData.instruments[5])
// Returns: { id: 5, name: 'flute' }
```

### mcData.instrumentsArray

Array of instruments

## Materials

### mcData.materials

Material types indexed by name

Example:

```js
console.log(mcData.materials['mineable/axe'])
// Returns: { '702': 2, '707': 4, '712': 12, '717': 6, '722': 8, '727': 9 }
```

## Entities

### mcData.mobs

Mobs (passive, neutral, and hostile) indexed by id

Example:

```js
console.log(mcData.mobs[30]) // Object containing information for "Ghast"
```

### mcData.objects

Objects (non-mob entities such as vehicles and projectiles) indexed by id

Example:

```js
const mcData = MinecraftData('1.8.9')

console.log(mcData.objects[10]) // Object containing information for "Minecart"
```

### mcData.entities

Entities indexed by id

Example:

```js
console.log(mcData.entities[25]) // Object containing information for "Evoker"
```

### mcData.entitiesByName

Entities indexed by name

Example:

```js
console.log(mcData.entitiesByName['evoker']) // Object containing information for "Evoker"
```

### mcData.entitiesArray

Array of entities

## Enchantments

### mcData.enchantments

Enchantments indexed by id

Example:

```js
console.log(mcData.enchantments[37]) // Object containing information for "Mending"
```

### mcData.enchantmentsByName

Enchantments indexed by name

Example:

```js
console.log(mcData.enchantmentsByName['mending']) // Object containing information for "Mending"
```

### mcData.enchantmentsArray

Array of enchantments

### mcData.defaultSkin

**_Bedrock edition only_**

Skin geometry and texture data for default player skin

## Protocol

### mcData.protocol

The Minecraft protocol

### mcData.protocolComments

The Minecraft protocol comments

### mcData.protocolYaml

**_Bedrock edition only_**

The url to the files of the protocol yaml

## Windows (GUIs)

### mcData.windows

Windows indexed by id

Example:

```js
console.log(mcData.windows['minecraft:villager']) // Object containing window information for the villager GUI
```

### mcData.windowsByName

Windows indexed by name

Example:

```js
console.log(mcData.windowsByName['NPC Trade']) // Object containing window information for the villager GUI
```

### mcData.windowsArray

Array of windows

## Version

For version comparison, the other version must be of the same type, and the prefix is always implied

### mcData.version.version

The version number

Example:

```js
console.log(mcData.version.version) // 759
```

### mcData.version.minecraftVersion

The full Minecraft version

Example:

```js
console.log(mcData.version.minecraftVersion) // 1.19
```

### mcData.version.type

The version type, either `pc` or `bedrock`

Example:

```js
console.log(mcData.version.type) // pc
```

### mcData.version.majorVersion

The major Minecraft version

Example:

```js
const mcData = MinecraftData('1.16.5')

console.log(mcData.version.majorVersion) // 1.16
```

### mcData.version.dataVersion

The "data version" for this Minecraft version, used for example when writing chunks to disk

Example:

```js
console.log(mcData.version.dataVersion) // 3105
```

### mcData.version.[<](<version>), mcData.isOlderThan(<version>)

Returns `true` if the current version is less than than the other version's `dataVersion`, or else `false`

### mcData.version.[<=](<version>)

Same as above but also checks for an equivalent `dataVersion`

### mcData.version.[==](<version>)

Returns `true` if the current version is equal to the other version's `dataVersion`, or else `false`

### mcData.version.[>](<version>)

Returns `true` if the current version is greater than the other version's `dataVersion`, or else `false`

### mcData.version.[>=](<version>), mcData.isNewerOrEqualTo(<version>)

Same as above but also checks for an equivalent `dataVersion`

Example Usage:

```js
const mcData = MinecraftData('1.16.4')
console.log(mcData.version['>=']('1.17')) // Returns false, as 1.16.4 is older than 1.17

const mcData = MinecraftData('bedrock_1.17.0')
console.log(mcData.version['>']('1.16.220')) // Returns true, as 1.17.0 is newer than 1.16.220
```

## Effects

### mcData.effects

Effects indexed by id

Example:

```js
console.log(mcData.effects[5]) // Object containing information for "Strength"
```

### mcData.effectsByName

Effects indexed by name

Example:

```js
console.log(mcData.effectsByName['strength']) // Object containing information for "Strength"
```

### mcData.effectsArray

Array of effects

## Attributes

### mcData.attributes

Attributes indexed by resource name

Example:

```js
console.log(mcData.attributes['minecraft:generic.movement_speed']) // Object containing information for "minecraft:generic.movement_speed"
```

### mcData.attributesByName

Attributes indexed by name

Example:

```js
console.log(mcData.attributesByName['movementSpeed']) // Object containing information for "minecraft:generic.movement_speed"
```

### mcData.attributesArray

Array of attributes

## Particles

### mcData.particles

Particles indexed by id

Example:

```js
console.log(mcData.particles[12]) // Object containing information for "dripping_water"
```

### mcData.particlesByName

Particles indexed by name

Example:

```js
console.log(mcData.particlesByName['dripping_water']) // Object containing information for "dripping_water"
```

### mcData.particlesArray

Array of particles

## Commands

### mcData.commands

Commands and parsers

Example:

```js
const mcData = MinecraftData('1.13')

console.log(mcData.commands)
// Returns:
// {
//   root: {
//     type: 'root',
//     name: 'root',
//     executable: false,
//     redirects: [],
//     children: [ ... ]
//   },
//   parsers: [ ... ]
// }
```

## Loot

### mcData.entityLoot

Entity loot indexed by entity name

Example:

```js
console.log(mcData.entityLoot['zombie']) // Object containing loot information for "Zombie"
```

### mcData.entityLootArray

Array of entity loot

### mcData.blockLoot

Block loot indexed by block name

Example:

```js
console.log(mcData.blockLoot['diamond_ore']) // Object containing loot information for "Diamond Ore"
```

### mcData.blockLootArray

Array of block loot

## Map icons

### mcData.mapIcons

Map icons indexed by id

Example:

```js
console.log(mcData.mapIcons[20]) // Object containing map icon information for "banner_purple"
```

### mcData.mapIconsByName

Map icons indexed by name

Example:

```js
console.log(mcData.mapIconsByName['banner_purple']) // Object containing map icon information for "banner_purple"
```

### mcData.mapIconsArray

Array of map icons

### mcData.type

The type of the current version, either `pc` or `bedrock`

### minecraftData.language

Object containing `en_US` language conversions

Example:

```js
console.log(mcData.language['argument.player.unknown'])
// Returns: 'That player does not exist'
```

### minecraftData.loginPacket

Login packet example

### mcData.supportFeature(<feature>)

This can be used to check if a specific feature is available in the current Minecraft version. This is usually only used for handling version-specific functionality.

Example:

```js
const mcData = minecraftData('1.18.2')

console.log(mcData.supportFeature('blockStateId')) // Returns: true
```

## Tints

### mcData.tints

Tints indexed by the tint type (`grass`, `foliage`, `water`, `redstone`, `constant`)

## Protocol versions

These are common data and directly available in the `minecraftData` object.
No need to specify a version before accessing them.

### minecraftData.versions

Array of all Minecraft versions (separated into `pc` (java) and `bedrock`)

### minecraftData.versionsByMinecraftVersion

All versions indexed by Minecraft version (separated into `pc` (java) and `bedrock`)

### minecraftData.preNettyVersionsByProtocolVersion

Pre-netty Minecraft versions indexed by protocol version (separated into `pc` (java) and `bedrock`)

### minecraftData.postNettyVersionsByProtocolVersion

Post netty minecraft versions indexed by protocol version (separated into `pc` (java) and `bedrock`)

### minecraftData.supportedVersions

Array of supported versions (separated into `pc` (java) and `bedrock`)

### minecraftData.legacy.pc.blocks

Mapping from 1.12 block:metadata to 1.13 block names

Example:

```js
console.log(mcData.legacy.pc.blocks['171:15']) // Returns: 'minecraft:black_carpet'
```

## Schemas

These are common data and directly available in the `minecraftData` object.
No need to specify a version before accessing them.

Available schemas:

`biomes`, `blocks`, `blockLoot`, `effects`, `entities`, `entityLoot`, `instruments`, `items`, `materials`, `particles`, `protocol`, `protocolVersions`, `recipes`, `version`, `windows`
