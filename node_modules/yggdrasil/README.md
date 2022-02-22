# yggdrasil
[![NPM version](https://img.shields.io/npm/v/yggdrasil.svg)](http://npmjs.com/package/yggdrasil)
[![Build Status](https://github.com/PrismarineJS/node-yggdrasil/workflows/CI/badge.svg)](https://github.com/PrismarineJS/node-yggdrasil/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-brightgreen.svg)](https://gitter.im/PrismarineJS/general)
[![Irc](https://img.shields.io/badge/chat-on%20irc-brightgreen.svg)](https://irc.gitter.im/)

[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/node-yggdrasil)

A Node.js client for doing requests to yggdrasil, the Mojang authentication system, used for Minecraft and Scrolls.

# Usage
    $ npm install yggdrasil

## Client
```js
//init
const ygg = require('yggdrasil')({
  //Optional settings object
  host: 'https://authserver.mojang.com' //Optional custom host. No trailing slash.
});

//Authenticate a user
ygg.auth({
  token: '', //Optional. Client token.
  agent: '', //Agent name. Defaults to 'Minecraft'
  version: 1, //Agent version. Defaults to 1
  user: '', //Username
  pass: '', //Password
  requestUser: false //Optional. Request the user object to be included in response
}).then(
  (response)=>{},
  (error)=>{}
);

//Refresh an accessToken
ygg.refresh(oldAccessToken, clientToken, true).then(
  ({accessToken, clientToken, user?})=>{},
  (error)=>{}
);
// Note that requestUser is an optional parameter. If set to true, it requests the user object from Mojang's authentication servers as well.

//Validate an accessToken
ygg.validate(token).then(
  (response)=>{},
  (error)=>{}
);

//Invalidate all accessTokens
ygg.signout(username, password).then(
  (response)=>{},
  (error)=>{}
);
```

## Server
```js
const yggserver = require('yggdrasil').server({
  //Optional settings object
  host: 'https://authserver.mojang.com' //Optional custom host. No trailing slash.
});

//Join a server (clientside)
yggserver.join(token, profile, serverid, sharedsecret, serverkey).then(
  (response)=>{},
  (error)=>{}
);

//Join a server (serverside)
yggserver.hasJoined(username, serverid, sharedsecret, serverkey).then(
  (clientInfo)=>{},
  (error)=>{}
);
```
## Proxy Support
```js
const ProxyAgent = require('proxy-agent');

const ygg = require('yggdrasil')({
  //Any type of HTTP Agent 
  agent: new ProxyAgent('https://example.com:8080')
});
```

# Further Reading
* [Authentication protocol documentation](http://wiki.vg/Authentication)
* [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol), a Minecraft client and server in Node.js
