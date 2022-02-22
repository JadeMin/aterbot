# prismarine-auth
[![NPM version](https://img.shields.io/npm/v/prismarine-auth.svg)](http://npmjs.com/package/prismarine-auth)
[![Build Status](https://github.com/PrismarineJS/prismarine-auth/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-auth/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/prismarine-auth)

Quickly and easily obtain auth tokens to authenticate with Microsoft/Xbox/Minecraft/Mojang

## Installation
```shell
npm install prismarine-auth
```

## Usage

### Authflow
**Parameters**
- username? {String} - Username for authentication
- cacheDirectory? {String | Function} - Where we will store your tokens (optional) or a factory function that returns a cache.
- options {Object?}
    - [password] {string} - If passed we will do password based authentication.
    - [doSisuAuth] {boolean} - See the [API.md](docs/API.md)
    - [authTitle] {string} - See the [API.md](docs/API.md)
    - [deviceType] {string} - See the [API.md](docs/API.md)
- onMsaCode {Function} - (For device code auth) What we should do when we get the code. Useful for passing the code to another function.

[View more examples](https://github.com/PrismarineJS/prismarine-auth/tree/master/examples)

### Examples

### getMsaToken
```js
const { Authflow, Titles } = require('prismarine-auth')

const userIdentifier = 'any unique identifier'
const cacheDir = './' // You can leave this as undefined unless you want to specify a caching directory
const options = {}
const flow = new Authflow(userIdentifier, cacheDir, options)
// Get a auth token, then log it
flow.getMsaToken().then(console.log)
```

### getXboxToken
See [docs/API.md](docs/API.md)


### getMinecraftJavaToken
```js
const { Authflow, Titles } = require('prismarine-auth')

const userIdentifier = 'any unique identifier'
const cacheDir = './' // You can leave this as undefined unless you want to specify a caching directory
const flow = new Authflow(userIdentifier, cacheDir, { authTitle: false })
// Get a Minecraft Java Edition auth token, then log it
flow.getMinecraftJavaToken().then(console.log)
```

### Expected Response
```json
{
    "token": "ey....................",
    "entitlements": {},
    "profile": {
        "id": "b945b6ed99b548675309473a69661b9a",
        "name": "Usname",
        "skins": [ [Object] ],
        "capes": []
    }
}
```

### getMinecraftBedrockToken
See [docs/API.md](docs/API.md) and [example](examples).

## API

See [docs/API.md](docs/API.md)

## Debugging

You can enable some debugging output using the `DEBUG` enviroment variable. Through node.js, you can add `process.env.DEBUG = 'prismarine-auth'` at the top of your code.


## Testing

Simply run `npm test` or `yarn test`

## License

[MIT](LICENSE)
