# prismarine-biome
[![NPM version](https://img.shields.io/npm/v/prismarine-biome.svg)](http://npmjs.com/package/prismarine-biome)
[![Build Status](https://github.com/PrismarineJS/prismarine-biome/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-biome/actions?query=workflow%3A%22CI%22)

Represent a minecraft biome with its associated data

## Usage

```js
const registry = require('prismarine-registry')('1.8')
const Biome = require("prismarine-biome")(registry);

const ocean = new Biome(registry.biomesByName.ocean.id)
console.log(ocean)
```

## API

### Biome

#### biome.id

Numerical id.

#### biome.color

#### biome.height

#### biome.name

#### biome.rainfall

#### biome.temperature

## History

### 1.3.0

* Bump mcdata

### 1.2.1
* Handle registry without biome info

### 1.2.0
* support pregistry

### 1.1.2
* Update type definitions

### 1.1.1

* move standard to dev dep

### 1.1.0

* typescript definitions (thanks @IdanHo)

### 1.0.1

* bump mcdata

### 1.0.0

* bump mcdata major

### 0.1.0

* Import from mineflayer
