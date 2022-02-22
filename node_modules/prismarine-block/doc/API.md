## Block

#### Block.fromStateId(stateId, biomeId)

#### Block(type,biomeId,metadata)

Constructor of a block
* `type` is the block numerical id
* `biomeId` is the biome numerical id
* `metadata` is the metadata numerical value

#### block.canHarvest(heldItemType)

Tells you if `heldItemType` is one of the right tool to harvest the block.

 * `heldItemType` the id of the held item (or null if nothing is held)

#### block.getProperties()

Parse the block state and return its properties.

#### block.digTime(heldItemType, creative, inWater, notOnGround, enchantments = [], effects = {})

Tells you how long it will take to dig the block, in milliseconds.

 * `heldItemType` the id of the held item (or null if nothing is held)
 * `creative` game in creative
 * `inWater` the bot is in water
 * `notOnGround` the bot is not on the ground
 * `enchantments` list of enchantments from the held item (from simplified nbt data) **AND** equipped armor - Aqua Affinity enchantment on helmet also affects breaking speed
 * `effects` effects on the bot (bot.entity.effects)

#### block.position

Vec3 instance.

#### block.type

Numerical id.

#### block.name

#### block.displayName

#### block.shapes

Array of bounding boxes representing the block shape. Each bounding box is an array of the form `[xmin, ymin, zmin, xmax, ymax, zmax]`. Depends on the type and state of the block.

#### block.entity

If this block is a block entity, this contains the NBT data for the entity

#### block.blockEntity

Simplified block entity data using prismarine-nbt's simplify() function. Only for reading - data modified here cannot be saved back later.

#### block.metadata

Number which represents different things depending on the block.
See http://www.minecraftwiki.net/wiki/Data_values#Data

#### block.light

#### block.skyLight

#### block.hardness

#### block.biome

A biome instance. See [Biome](https://github.com/prismarinejs/prismarine-biome#api).

#### block.signText

If the block is a sign, contains the sign text.

#### block.painting

If the block is a painting, contains information about the painting.

 * `id`
 * `position`
 * `name`
 * `direction` - direction vector telling how the painting is facing.

#### block.diggable

Boolean, whether the block is considered diggable.

#### block.boundingBox

The shape of the block according to the physics engine's collision decection. Currently one of:

 * `block` - currently, partially solid blocks, such as half-slabs and ladders, are considered entirely solid.
 * `empty` - such as flowers and lava.

#### block.transparent

 Boolean, true if the block texture has some transparency.

#### block.material

This tells what types of tools will be effective against the block. Possible
values are: `null`, `rock`, `wood`, `plant`, `melon`, `leaves`, `dirt`, `web`, and `wool`.

See http://www.minecraftwiki.net/wiki/Digging and the `toolMultipliers`
variable at the top of lib/plugins/digging.js for more info.

#### block.harvestTools

The set of tools that will allow you to harvest the block.

#### block.drops

The blocks or items dropped by that block.

## Block entities

Some blocks may have entity data attached to them. If they do, they contain extra fields which can manipulate the entity NBT data

### sign

#### .blockEntity

Returns 4 fields with .Text1, .Text2, .Text3, .Text4 each containing instances of prismarine-chat ChatMessage, if a block entity exists for the sign.

#### get .signText

Returns a plaintext string containing the sign's text

#### set .signText

Sets the text for a sign's text, can be plaintext, or array of JSON or prismarine-chat instances
