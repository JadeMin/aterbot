## History

### 1.7.2

* Fix broken type definitions (@IceTank) [#81](https://github.com/PrismarineJS/prismarine-chat/pull/81)

### 1.7.1

* Fix release 

### 1.7.0

* Support 1.19 client side message formatting (@extremeheat)
* Fix motd color codes bleeding through their with block (@U9g)

### 1.6.1

* Update mcdata

### 1.6.0

* Added number type to getText()'s idx argument
* Remove resets on empty strings

### 1.5.0

* allow ChatMessage constructor to accept strings with legacy color codes (§) be converted to new json

### 1.4.1
* Remake ChatMessage#clone (@u9g)

### 1.4.0
* Add a example (@u9g)
* Add hex color code support (@U5B)
* use rest arg to allow many withs or extras (@u9g)
* Add missing json attribute to typescript defintions (@Paulomart & @u9g)

### 1.3.3
* fix typings

### 1.3.2
* Properly export loader function and export ChatMessage & MessageBuilder as types

### 1.3.1
* export ChatMessage object in typings

### 1.3.0
* add typings (@Gjum)

### 1.2.0
* Added fromNotch() (@u9g)
* Add support for array chat messages (@mat-1)

### 1.1.0
* Added MessageBuilder (@u9g)

### 1.0.4

* Added clone() and append() (@builder-247)
* update mojangson to 2.0.0 (@u9g)
* Add trailing color reset to .toAnsi() (@DrMoraschi)

### 1.0.3

* by default hide warnings

### 1.0.2

* ignore mojangson parsing error

### 1.0.1

* make lang option in toAnsi optional

### 1.0.0

* initial implementation
* extracted from mineflayer
