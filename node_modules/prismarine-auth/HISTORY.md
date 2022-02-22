## History

### 1.4.1
* Correct missing await statement in live token refreshing (#29) - @dustinrue

### 1.4.0

* Allow to use a custom cache instead of using the filesystem only (#26) - @Paulomart
* Replace `fs.rmdirSync` with `fs.rmSync` (#25)
* Add `doSisuAuth` option (#24)

### 1.3.0
* Add `deviceType` and `deviceVersion` options to Authflow options [#21](https://github.com/PrismarineJS/prismarine-auth/pull/21)

### 1.2.1

* bump jose dep

### 1.2.0
* Improve error handling (#15)
* Fix caching, relyingParty issue (#13)
* Documentation updates, see [API usage](https://github.com/PrismarineJS/prismarine-auth/blob/master/docs/API.md).

### 1.1.2

* proper fix

### 1.1.1

* fix jose dep

### 1.1.0

* Added entitlement and profile checks for Minecraft Java Token
* Fixed bug when fetching only the xbox token
* Added examples
* Added index.d.ts

### 1.0.0

* initial implementation
