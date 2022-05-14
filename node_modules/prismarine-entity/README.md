# prismarine-entity
[![NPM version](https://img.shields.io/npm/v/prismarine-entity.svg)](http://npmjs.com/package/prismarine-entity)
[![Build Status](https://github.com/PrismarineJS/prismarine-entity/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-entity/actions?query=workflow%3A%22CI%22)

Represent a minecraft entity

## Usage

```js
const Entity = require("prismarine-entity")('1.8.9')

const entity = new Entity(0)
console.log(entity)
```

## API

### Entity

Entities represent players, mobs, and objects.

#### entity.id

#### entity.type

Choices:

 * `player`
 * `mob`
 * `object`
 * `global` - lightning
 * `orb` - experience orb.
 * `other` - introduced with a recent Minecraft update and not yet recognized or used by a third-party mod

#### entity.username

If the entity type is `player`, this field will be set.

#### entity.mobType

If the entity type is `mob`, this field will be set.

#### entity.displayName

Field set for mob and object. A long name in multiple words.

#### entity.entityType

Field set for mob and object. The numerical type of the entity (1,2,...)

#### entity.kind

Field set for mob and object. The kind of entity (for example Hostile mobs, Passive mobs, NPCs).

#### entity.name

Field set for mob and object. A short name for the entity.

#### entity.objectType

If the entity type is `object`, this field will be set.

#### entity.count

If the entity type is `orb`, this field will be how much experience you
get from collecting the orb.

#### entity.position

#### entity.velocity

#### entity.yaw

#### entity.pitch

#### entity.height

#### entity.width

#### entity.onGround

#### entity.equipment[5]

 * `0` - held item
 * `1` - shoes
 * `2` - legging
 * `3` - torso
 * `4` - head
 

#### entity.heldItem

Equivalent to `entity.equipment[0]`.

#### entity.metadata

See http://wiki.vg/Entities#Entity_Metadata_Format for more details.

#### entity.noClip

#### entity.vehicle

Entity that this entity is riding on

#### entity.passenger

Entity that is riding on this entity

#### entity.health

The health of the player, default: 20

#### entity.food

The food of the player, default: 20

#### entity.player

The player

#### entity.getCustomName()

returns a `prismarine-chat` ChatMessage object for the name of the entity or null if there isn't one

#### entity.getDroppedItem()

returns a `prismarine-item` Item object for the dropped item, if this is a dropped item, or it will return null

## History

### 2.1.1

* Update mcdata

### 2.1.0

* Adds Entity#getDroppedItem

### 2.0.0

* require mcversion in constructor
* add Entity#getCustomName()
* Add attributes for entity entity collision calculation (thanks @O-of)

### 1.2.0

* Add food saturation to typings
* Add id to typings
* Add effects to typings

### 1.1.0

* Added entity width property

### 1.0.0

* typescript definitions (thanks @IdanHo)

### 0.2.0

* extend EventEmitter

### 0.1.0

* Import from mineflayer
