# node-minecraft-data

[![NPM version](https://badge.fury.io/js/minecraft-data.svg)](http://badge.fury.io/js/minecraft-data)
[![Tonic](https://img.shields.io/badge/tonic-try%20it-blue.svg)](https://tonicdev.com/npm/minecraft-data)
[![Build Status](https://github.com/PrismarineJS/node-minecraft-data/workflows/CI/badge.svg)](https://github.com/PrismarineJS/node-minecraft-data/actions?query=workflow%3A%22CI%22)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/node-minecraft-data)

`node-minecraft-data` provides easy access to [minecraft-data](https://github.com/PrismarineJS/minecraft-data) in node.js.

The objective of this module is to make easier to look for information in `minecraft-data` in node.

## Features

This package allows the lookup of blocks, items, entities, etc. by name, id, etc., and for the easy lookup of other data.

## Example

```js
const minecraftData = require('minecraft-data')
// or for es6: import minecraftData from 'minecraft-data';

const mcData = minecraftData('1.19')

console.log(mcData.blocksByName['stone']) // Information for "Stone"
console.log(mcData.windows['minecraft:brewing_stand']) // Information for the "Brewing Stand" GUI
console.log(mcData.version) // Information about the current version
console.log(mcData.effectsByName['Haste']) // Information for the "Haste" effect
```

## Documentation

* See [doc/api.md](doc/api.md)
* See [doc/history.md](doc/history.md)
