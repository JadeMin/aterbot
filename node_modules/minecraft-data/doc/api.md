# API

## Blocks

### minecraft-data.blocks

blocks indexed by id

### minecraft-data.blocksByName

blocks indexed by name

### minecraft-data.blocksArray

unindexed blocks

### minecraft-data.blocksByStateId

blocks indexed by state id

### minecraft-data.blockCollisionShapes

block collision shapes

## Items

### minecraft-data.items

items indexed by id

### minecraft-data.itemsByName

items indexed by name

### minecraft-data.itemsArray

unindexed items

## Foods

### minecraft-data.foods

foods indexed by id

### minecraft-data.foodsByName

foods indexed by name

### minecraft-data.foodsByFoodPoints

foods indexed by food points

### minecraft-data.foodsBySaturation

foods indexed by saturation

### minecraft-data.foodsArray

unindexed foods

## Biomes

### minecraft-data.biomes

biomes indexed by id

### minecraft-data.biomesArray

unindexed biomes

### minecraft-data.biomesByName

biomes object indexed by name

## Recipes

### minecraft-data.recipes

recipes indexed by id

## Instruments

### minecraft-data.instruments

instruments indexed by id

### minecraft-data.instrumentsArray

unindexed instruments

## Materials

### minecraft-data.materials

materials indexed by name

## Entities

### minecraft-data.mobs

mobs indexed by id

### minecraft-data.objects

objects indexed by id

### minecraft-data.entitiesByName

entities indexed by name

### minecraft-data.entitiesArray

unindexed entities

## Enchantments

### minecraft-data.enchantments

enchantments indexed by id

### minecraft-data.enchantmentsByName

enchantments indexed by name

### minecraft-data.enchantmentsArray

unindexed enchantments

### minecraft-data.defaultSkin

(bedrock edition) Skin geometry and texture data for default player skin

## Protocol

### minecraft-data.protocol

the minecraft protocol


### minecraft-data.protocolComments

the minecraft protocol comments

## Functions

### minecraft-data.findItemOrBlockById

find a block or an item by its id

### minecraft-data.findItemOrBlockByName

find a block or an item by its name

## Windows

### minecraft-data.windows

windows indexed by id

### minecraft-data.windowsByName

windows indexed by name

### minecraft-data.windowsArray

unindexed windows


## Version

### minecraft-data.version.version

the version number (example : 47)

### minecraft-data.version.minecraftVersion

the minecraft number (example : 1.8.3)

### minecraft-data.version.type

the version type, currently 'pc' or 'bedrock'

### minecraft-data.version.majorVersion

the major version (example : 1.8), also the name of the minecraft-data version

### minecraft-data.version.dataVersion

"Data version" for this Minecraft version, used for example when writing chunks to disk

### minecraft-data.version.< (other)
Returns true if the current version is less than than the `other` version's dataVersion

### minecraft-data.version.> (other)
Returns true if the current version is greater than the `other` version's dataVersion

### minecraft-data.version.== (other)
Returns true if the current version is equal to the `other` version's dataVersion

### minecraft-data.version.>=, minecraft-data.version.<=

Same as above but also allows equal dataVersion. The other version must be of the same type, the prefix is always implied.

Example Usage: 
```js
const mcd = require('minecraft-data')('1.16.4')
console.log('1.16.4 >= 1.17 ?', mcd.version['>=']('1.17')) // False

const mcd = require('minecraft-data')('bedrock_1.17.0')
console.log('1.17.0 > 1.16.220 ?', mcd.version['>']('1.16.220')) // True
```

## Effects

### minecraft-data.effects

effects indexed by id

### minecraft-data.effectsByName

effects indexed by name

### minecraft-data.effectsArray

unindexed effects

## Attributes

### minecraft-data.attributes

attributes indexed by resource name (generic.movementSpeed || minecraft:generic.movement_speed)

### minecraft-data.attributesByName

attributes indexed by minecraft-data name (movementSpeed)

### minecraft-data.attributesArray

unindexed attributes

## Particles

### minecraft-data.particles

particles indexed by id

### minecraft-data.particlesByName

particles indexed by name

### minecraft-data.particlesArray

unindexed particles

## Commands

### minecraft-data.commands 

Command tree

## Loot

### minecraft-data.entityLoot

entity loot indexed by name

### minecraft-data.entityLootArray

unindexed entity loot

### minecraft-data.blockLoot

block loot indexed by name

### minecraft-data.blockLootArray

unindexed block loot

## Map icons

### minecraft-data.mapIcons

mapIcons indexed by id

### minecraft-data.mapIconsByName

mapIcons indexed by name

### minecraft-data.mapIconsArray

unindexed mapIcons

## type

pe or pc

## minecraft-data.language

object from language key to string

## minecraft-data.loginPacket

example of login packet

## Protocol versions

Those are common data and directly available in the `require('minecraft-data')` object.
No need to specify a version before accessing them. They are indexed by pc and pe.

### minecraft-data.versions

unindexed minecraft versions

### minecraft-data.versionsByMinecraftVersion

minecraft versions indexed by minecraft version (example : 1.8.8)

### minecraft-data.preNettyVersionsByProtocolVersion

pre netty minecraft versions indexed by protocol version (example : 47)

### minecraft-data.postNettyVersionsByProtocolVersion

post netty minecraft versions indexed by protocol version (example : 47)

### minecraft-data.supportedVersions.pc

Array of pc supported versions

### minecraft-data.supportedVersions.pe

Array of pe supported versions

### minecraft-data.legacy.pc.blocks

Mapping from 1.12 block:metadata to 1.13 block names

examples 0:0 -> minecraft:air

## Schemas

### minecraft-data.schemas.biomes

### minecraft-data.schemas.blocks

### minecraft-data.schemas.blockLoot

### minecraft-data.schemas.effects

### minecraft-data.schemas.entities

### minecraft-data.schemas.entityLoot

### minecraft-data.schemas.instruments

### minecraft-data.schemas.items

### minecraft-data.schemas.materials

### minecraft-data.schemas.particles

### minecraft-data.schemas.protocol

### minecraft-data.schemas.protocolVersions

### minecraft-data.schemas.recipes

### minecraft-data.schemas.version

### minecraft-data.schemas.windows
