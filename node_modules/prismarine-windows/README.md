# prismarine-windows

[![Build Status](https://github.com/PrismarineJS/prismarine-windows/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-windows/actions?query=workflow%3A%22CI%22)

Represent minecraft windows. Check [mineflayer-web-inventory](https://github.com/ImHarvol/mineflayer-web-inventory) to display windows.

Read the [API](API.md).

## Usage

```js
const windows = require('./')('1.8')
const Item = require('prismarine-item')('1.8')

const inv = windows.createWindow(1, 'minecraft:inventory', 'inv', 36)

inv.updateSlot(10, new Item(256, 1))

console.log(inv.items())

```
