# prismarine-registry
[![NPM version](https://img.shields.io/npm/v/prismarine-registry.svg)](http://npmjs.com/package/prismarine-registry)
[![Build Status](https://github.com/PrismarineJS/prismarine-registry/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-registry/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/prismarine-registry)

Creates an dynamic instance of node-minecraft-data.

## Usage

```js
const registry = require('prismarine-registry')('1.18')

registry.blocksByName['stone'] // See information about stone
```

## API

[See minecraft-data API](https://github.com/PrismarineJS/node-minecraft-data/blob/master/doc/api.md)

### mcpc

#### loadDimensionCodec / writeDimensionCodec

* loads/writes data from dimension codec in login packet

#### .chatFormattingByName, .chatFormattingById (1.19+)

Contains mapping from chat type ID (numeric or string) to information about how the 
chat type should be formatted and what the relevant parameters are.

```js
{
  'minecraft:chat': { formatString: '<%s> %s', parameters: [ 'sender', 'content' ] },
  'minecraft:say_command': { formatString: '[%s] %s', parameters: [ 'sender', 'content' ] },
  'minecraft:msg_command': { formatString: '%s whispers to you: %s', parameters: [ 'sender', 'content' ] },
  'minecraft:team_msg_command': { formatString: '%s <%s> %s', parameters: [ 'team_name', 'sender', 'content' ] },
  'minecraft:emote_command': { formatString: '* %s %s', parameters: [ 'sender', 'content' ] }
}
```

#### .dimensionsById, dimensionsByName (1.19+)

Mapping to dimension data object containing dimension `name`, `minY` and `height`.
