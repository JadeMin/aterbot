# node-mojangson
[![NPM version](https://badge.fury.io/js/mojangson.svg)](http://badge.fury.io/js/mojangson) ![CI](https://github.com/PrismarineJS/node-mojangson/workflows/CI/badge.svg)

node-mojangson is a mojangson parser.

## Mojangson specification
Mojangson is mojang's variant of json. It is basically json with the following changes :

 * array can be indexed (example : `[0:"v1",1:"v2",2:"v3"]`)
 * array and object can have trailing comma (example : `[5,4,3,]` and `{"a":5,"b":6,}`)
 * there can be string without quote (example : `{mykey:myvalue}`)
 * numbers can be suffixed by b, s, l, f, d, i or the same in upper case (example : `{number:5b}`)
 * mojangson stays a superset of json : every json is a mojangson

 Reference https://minecraft.gamepedia.com/Commands#Data_tags

## Parser
This parser is build using nearley.

See the [grammar](grammar.ne) and the examples in the [test](test/test.js) for more information.

## Usage
Usage example :

```js
const mojangson = require('mojangson')

const data = mojangson.parse('{mykey:myvalue}')

// print the parsed data
console.log(data)

// print the simplified data
condole.log(mojangson.simplify(data))
```

The provided method `mojangson.parse` return a javascript object corresponding to the mojangson passed in input.

`mojangson.simplify` returns a simplified representation : keep only the value to remove one level. This loses the types so you cannot use the resulting representation to write it back.

`mojangson.stringify` will take a js object with types and values for mojangson and make it into a normalized mojangson string

```js
const mojangson = require('mojangson')
const data = mojangson.stringify({ type: 'list', value: { type: 'string', value: [ 'z1', 'z2' ] } })
console.log(data) // => [z1,z2]
```

Another example, the provided method `mojangson.normalize` takes a string of mojangson and normalizes it in the shortest way to retain all data. Comparing it to the original will tell you if you have the shortest equivalent to a string of mojangson.

```js
const mojangson = require('mojangson')
const original = '[0:"z1",1:"z2"]'
const data = mojangson.normalize(original)
console.log(data) // => [z1,z2]
const optimized = original === data
console.log(optimized) // => false
```


## History

### 2.0.2

* fixes issue where strings starting with a number would be parsed as a number (@U9G)

### 2.0.1

* fix escaping some chars in mojangson.stringify (@U9G)
* update grammar for unicode escaped strings (@U9G)
* fix parsing of escaped characters (@Majorblake)

### 2.0.0

* Changes output format to include types (@Karang)
* add simplify function
* Add stringify function to go back to mojangson (@U9G)

### 1.1.1

* Fix empty string parsing (thanks @IdanHo)

### 1.1.0

* switch to nearley parser for a better handling for mojangson (thanks @Karang)

### 1.0.0

* stop printing error

### 0.2.4

* add support for double and int

### 0.2.3

* fix release about grammar.js still containing the cli

### 0.2.2

* disable jison cli to make mojangson compatible with browserify

### 0.2.1

* fix state conflict due to recent trailing comma fix

### 0.2.0

* Rename npm package to mojangson
* fix trailing comma in arrays

### 0.1.1

* better error displaying

### 0.1

* First release, basic functionality
