# API

## World

The API is split in 2 :
* the World which is async 
* the World.sync which is sync

The characteristics of the async world is that it will always return something when getting a block, but as a promise. To achieve this it 
may load columns from anvil files or other storage. On the other hand the sync world will not always return blocks and may return null, 
but it will return the block directly with no promise.

The set operations have similar characteristics : the async world will always set the blocks and return a promise, whereas the sync world will 
not always set the blocks, but do the action now and not return a promise.

The 2 world are linked and stay in sync together.

The async world may be more natural for servers (although the sync world can also be used there)
The sync world makes more sense for clients as there is not necessarily somewhere to load more data from (but in some cases this may be incorrect too, think 
multi player clients)

### World([generateChunk,[storageProvider]],[savingInterval])

Create a world instance, takes an optional `generateChunk(chunkX, chunkZ)` function that will get called when a chunk at 
`chunkX` and `chunkZ` need to be generated. Takes a second optional arguments : `storageProvider` containing the regions.
If provided, prismarine-world will first try to load the map from these regions, and then try to generate the world if 
the chunk isn't saved. `savingInterval` default to 50ms.

#### "blockUpdate" (oldBlock, newBlock)

Fires when a block updates. Both `oldBlock` and `newBlock` provided for
comparison.

Note that `oldBlock` may be `null`.

#### "blockUpdate:(x, y, z)" (oldBlock, newBlock)

Fires for a specific point. Both `oldBlock` and `newBlock` provided for
comparison.

Note that `oldBlock` may be `null`.

#### "chunkColumnLoad" (point)
#### "chunkColumnUnload" (point)

Fires when a chunk has updated. `point` is the coordinates to the corner
of the chunk with the smallest x, y, and z values.

### World.initialize(iniFunc,length,width,height=256,iniPos=new Vec3(0,0,0))

Initialize the world with a given blocks cube. Useful to load quickly a schematic.

* `iniFunc` is a function(x,y,z) that returns a prismarine-block
* `length`, `width` and `height` are the size to iterate on
* `iniPos` is the position where to start the iteration

Returns a promise containing an array of `{chunkX,chunkZ}`

### World.raycast(from, direction, range, matcher = null)

Raycast in the world.

* `from` - Vec3, position to raycast from
* `direction` - Vec3, direction of the ray, must be normalized
* `range` - max distance to raycast
* `matcher` - optional function with a block parameter, return true if the raycast should stop at this block, false otherwise

### World.getColumns()

Return all loaded columns

### World.unloadColumn(chunkX,chunkZ)

Unload column from memory

All the following methods are async and return a promise.

### World.setColumn(chunkX,chunkZ,chunk)

Set `chunk` at `chunkX` and `chunkZ`

### World.getColumn(chunkX,chunkZ)

Return the column at `chunkX` and `chunkZ`

### World.getBlock(pos)

Get the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

### World.setBlock(pos,block)

Set the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

### World.getBlockStateId(pos)

Get the block state at `pos`

### World.getBlockType(pos)

Get the block type at `pos`

### World.getBlockData(pos)

Get the block data (metadata) at `pos`

### World.getBlockLight(pos)

Get the block light at `pos`

### World.getSkyLight(pos)

Get the block sky light at `pos`

### World.getBiome(pos)

Get the block biome id at `pos`

### World.setBlockStateId(pos, stateId)

Set the block state `stateId` at `pos`

### World.setBlockType(pos, id)

Set the block type `id` at `pos`

### World.setBlockData(pos, data)

Set the block `data` (metadata) at `pos`

### World.setBlockLight(pos, light)

Set the block `light` at `pos`

### World.setSkyLight(pos, light)

Set the block sky `light` at `pos`

### World.setBiome(pos, biome)

Set the block `biome` id at `pos`

### World.waitSaving()

Returns a promise that is resolved when all saving is done.

### World.sync(asyncWorld)

Build a sync world, will delegate all the saving work to the async one

It exposes the same methods as World but all methods are sync.

## Iterators

Iterators are used to iterate over blocks. Use cases include finding specific blocks quickly and computing a ray cast.

### ManhattanIterator (x, y, maxDistance)

2D rectangular spiral iterator, useful to iterate on columns that are centered on bot position

#### next()

return null or the next position (Vec3)

### OctahedronIterator (start, maxDistance) 

start is a Vec3

#### next()

return null or the next position (Vec3)

### RaycastIterator (pos, dir, maxDistance) 

pos and dir are Vec3

RaycastIterator iterates along a ray starting at `pos` in `dir` direction. 
It steps exactly 1 block at a time, returning the block coordinates and the face by which the ray entered the block.

#### next()

return null or the next position (Vec3)

### SpiralIterator2d (pos, maxDistance)

`pos` is Vec3

`maxDistance` is number

Iterates outwards along x and z axis in a cubic spiral. First position returned is the starting position. Every step is 1 step away form the previous and next point. 

#### next()

return null or the next position (Vec3)

#### NUMBER_OF_POINTS

Number of points the iterator will return.

