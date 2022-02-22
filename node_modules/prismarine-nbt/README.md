# Prismarine-NBT
[![NPM version](https://img.shields.io/npm/v/prismarine-nbt.svg)](http://npmjs.com/package/prismarine-nbt)
[![Build Status](https://github.com/PrismarineJS/prismarine-nbt/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-nbt/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/prismarine-nbt)

Prismarine-NBT is a JavaScript parser and serializer for [NBT](http://wiki.vg/NBT) archives. It supports big, little, and little-varint encoded NBT files.


## Usage

#### as a async promise

```js
const fs = require('fs/promises')
const nbt = require('prismarine-nbt')

async function main(file) {
  const buffer = await fs.readFile(file)
  const { parsed, type } = await nbt.parse(buffer)
  console.log('JSON serialized', JSON.stringify(result, null, 2))
  fs.createWriteStream('file.nbt').write(nbt.writeUncompressed(result, type)) // Write it back 
}

main('file.nbt')
```

#### as a callback

```js
var fs = require('fs'),
    nbt = require('prismarine-nbt');

fs.readFile('bigtest.nbt', function(error, data) {
    if (error) throw error;

    nbt.parse(data, function(error, data) {
        console.log(data.value.stringTest.value);
        console.log(data.value['nested compound test'].value);
    });
});
```

If the data is gzipped, it is automatically decompressed, for the buffer see metadata.buffer

## API

### parse(data, [format]): Promise<{ parsed, type, metadata: { size, buffer? } }>
### parse(data, [format,] callback)

Takes an optionally compressed `data` buffer and reads the nbt data.

If the endian `format` is known, it can be specified as 'big', 'little' or 'littleVarint'. If not specified, the library will
try to sequentially load as big, little and little varint until the parse is successful. The deduced type is returned as `type`.

Minecraft Java Edition uses big-endian format, and Bedrock uses little-endian.

### writeUncompressed(value, format='big')

Returns a buffer with a serialized nbt `value`. 

### parseUncompressed(data, format='big')

Takes a buffer `data` and returns a parsed nbt value.


### simplify(nbt)

Returns a simplified nbt representation : keep only the value to remove one level.
This loses the types so you cannot use the resulting representation to write it back to nbt.

### protos : { big, little, littleVarint }

Provides compiled protodef instances used to parse and serialize nbt

### proto

Provide the big-endian protodef instance used to parse and serialize nbt.

### protoLE

Provide the little-endian protodef instance used to parse and serialize little endian nbt.

### builder

Provides a way to build complex nbt structures simply:

```js
const nbt = require('prismarine-nbt')
const tag = nbt.comp({
  Air: nbt.short(300),
  Armor: nbt.list(nbt.comp([
    { Count: nbt.byte(0), Damage: nbt.short(0), Name: nbt.string('a') },
    { Count: nbt.byte(0), Damage: nbt.short(0), Name: nbt.string('b') },
    { Count: nbt.byte(0), Damage: nbt.short(0), Name: nbt.string('c') }
  ]))
})
nbt.writeUncompressed(tag) // now do something with this nbt buffer...
```

See [index.d.ts](typings/index.d.ts#L69) for methods

## Browser usage

For webpack usage, see an example configuration [here](https://github.com/PrismarineJS/prismarine-web-client/blob/master/webpack.common.js#L28).

For a web bundle with browserify (after you ran `npm install prismarine-nbt` in your project):
```
npx browserify -r prismarine-nbt -r buffer -o pnbt.js
```
```html
<script src="./pnbt.js"></script>
<script>
  const nbt = require('prismarine-nbt')
  const { Buffer } = require('buffer')
  fetch('test.nbt').then(resp => resp.arrayBuffer())
    .then(buf => nbt.parse(Buffer.from(buf))).then(console.log)
</script>
```
