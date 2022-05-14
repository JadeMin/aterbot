# prismarine-block
[![NPM version](https://img.shields.io/npm/v/prismarine-block.svg)](http://npmjs.com/package/prismarine-block)
[![Build Status](https://github.com/PrismarineJS/prismarine-block/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-block/actions?query=workflow%3A%22CI%22)

Represent a minecraft block with its associated data

## Usage

```js
const registry = require('prismarine-registry')('1.8')
const Block = require('prismarine-block')(registry)

const stoneBlock = new Block(registry.blocksByName.stone, registry.biomesByName.plains, /* meta */ 0)

console.log(stoneBlock)

// can you harvest stone with an iron pickaxe ?
console.log(stoneBlock.canHarvest(257))

// how many milliseconds does it takes in usual conditions ? (on ground, not in water and not in creative mode)
console.log(stoneBlock.digTime(257))

```

## API

See [doc/API.md](doc/API.md)

## History

### 1.16.3

* really

### 1.16.2

* correct

### 1.16.1

* fix mcdata dep

### 1.15.0

* Effect names were normalized
* Metadata to 0 by default

### 1.14.1

* Legacy version fixes

### 1.14.0

* Add .stateId, .fromProperties, .getProps for all versions

### 1.13.1

* Change blockEntity version handling

### 1.13.0

* Add sign block entity implementation

### 1.12.0

* Updated to support `prismarine-registry`. To use, instead of passing a string to prismarine-biome's default function export, pass an instance of `prismarine-registry`.
* block entity support

### 1.11.0

* support bedrock

### 1.10.3

* use normalized enchant rather than custom format (@u9g #41)

### 1.10.2

* remove debug code

### 1.10.1

* Fix ternary operator for bedrock name check

### 1.10.0

* 1.17.0 support (thanks @Archengius and @the9g)

### 1.9.0

* added `block.getProperties()` type definitions.
* added instant breaking support
* added `Block.fromProperties()` constructor.

### 1.8.0

* Efficiency fix on versions below 1.13

### 1.7.3

* Fix effectLevel not working in digTime. (@Naomi-alt)

### 1.7.2

* add testing for shapes, make it more robust to missing data

### 1.7.1

* fix canHarvest when no harvestTools required (thanks @Garfield100)

### 1.7.0

* Add getProperties (thanks @Karang)

### 1.6.0

* Add enchantments and effects to dig time computation (thanks @Karang)

### 1.5.1

* Make Block.fromStateId work for all versions

### 1.5.0

* Fix block metadata for 1.13+

### 1.4.0

* add block shapes (thanks @Karang)

### 1.3.0

* add typescript definitions (thanks @IdanHo)

### 1.2.0

* Prevent data from being shared to avoid conflicts across multiple versions (thanks @hornta)

### 1.1.1

* use the minStateId if passing the blockType

### 1.1.0

* add block state id feature (for >= 1.13)

### 1.0.1

* bump mcdata

### 1.0.0

* bump dependencies

### 0.1.0

* Import from mineflayer
