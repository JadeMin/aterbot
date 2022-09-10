## History

### 1.7.0
* Breaking: Abstract fetchCertificates in MinecraftJavaTokenManager (#52) 

### 1.6.0

* Add fetchCertificates option to getMinecraftJavaToken

### 1.5.4

* XboxTokenManager: Combine `getXSTSToken` & `getXSTSTokenWithTitle` and implement own `getUserToken` ([#47](https://github.com/PrismarineJS/prismarine-auth/pull/47))

### 1.5.3
* Fix web request error logging expecting JSON response @LucienHH
* Add exception messages for more Xbox API errors @Kashalls

### 1.5.2
* Don't log authentication prompt if codeCallback is specified. ([#40](https://github.com/PrismarineJS/prismarine-auth/pull/40)) - @ATXLtheAxolotl

### 1.5.1
* Update User-Agent header @LucienHH

### 1.5.0
* Move relyingParty option from constructor to `getXboxToken(relyingParty?: string)` ([#34](https://github.com/PrismarineJS/prismarine-auth/pull/34))
* Fixed a bug that would cause refreshing the MSA token to error due to an undefined function 

### 1.4.2
* add debug dependency (#31) - @safazi

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
