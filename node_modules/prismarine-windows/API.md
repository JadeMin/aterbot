<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [windows.createWindow(id, type, title, slotCount = undefined)](#windowscreatewindowid-type-title-slotcount--undefined)
- [windows.Window (base class)](#windowswindow-base-class)
  - [properties](#properties)
    - [window.id](#windowid)
    - [window.type](#windowtype)
    - [window.title](#windowtitle)
    - [window.slots](#windowslots)
    - [window.inventoryStart](#windowinventorystart)
    - [window.inventoryEnd](#windowinventoryend)
    - [window.hotbarStart](#windowhotbarstart)
    - [window.craftingResultSlot](#windowcraftingresultslot)
    - [window.requiresConfirmation](#windowrequiresconfirmation)
    - [window.selectedItem](#windowselecteditem)
  - [Methods](#methods)
    - [window.acceptClick(click)](#windowacceptclickclick)
    - [window.acceptOutsideWindowClick(click)](#windowacceptoutsidewindowclickclick)
    - [window.acceptInventoryClick(click)](#windowacceptinventoryclickclick)
    - [window.acceptNonInventorySwapAreaClick(click)](#windowacceptnoninventoryswapareaclickclick)
    - [window.acceptSwapAreaRightClick(click)](#windowacceptswaparearightclickclick)
    - [window.acceptSwapAreaLeftClick(click)](#windowacceptswaparealeftclickclick)
    - [window.acceptCraftingClick(click)](#windowacceptcraftingclickclick)
    - [window.updateSlot(slot, newItem)](#windowupdateslotslot-newitem)
    - [window.findItemRange(start, end, itemType, metadata, [notFull], null)](#windowfinditemrangestart-end-itemtype-metadata-notfull)
    - [window.findItemRangeName(start, end, itemName, metadata, [notFull])](#windowfinditemrangenamestart-end-itemname-metadata-notfull)
    - [window.findInventoryItem(item, metadata, [notFull])](#windowfindinventoryitemitem-metadata-notfull)
    - [window.findContainerItem(item, metadata, [notFull])](#windowfindcontaineritemitem-metadata-notfull)
    - [window.firstEmptySlotRange(start, end)](#windowfirstemptyslotrangestart-end)
    - [window.firstEmptyHotbarSlot()](#windowfirstemptyhotbarslot)
    - [window.firstEmptyContainerSlot()](#windowfirstemptycontainerslot)
    - [window.firstEmptyInventorySlot(hotbarFirst = true)](#windowfirstemptyinventoryslothotbarfirst--true)
    - [window.countRange (start, end, itemType, metadata)](#windowcountrange-start-end-itemtype-metadata)
    - [window.itemsRange (start, end)](#windowitemsrange-start-end)
    - [window.count(itemType, [metadata])](#windowcountitemtype-metadata)
    - [window.items()](#windowitems)
    - [window.containerCount(itemType, [metadata])](#windowcontainercountitemtype-metadata)
    - [window.containerItems()](#windowcontaineritems)
    - [window.emptySlotCount()](#windowemptyslotcount)
    - [window.transactionRequiresConfirmation(click)](#windowtransactionrequiresconfirmationclick)
  - [Events](#events)
    - [window "updateSlot" (slot, oldItem, newItem)](#window-updateslot-slot-olditem-newitem)
    - [window "updateSlot:slot" (oldItem, newItem)](#window-updateslotslot-olditem-newitem)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## windows.createWindow(id, type, title, slotCount = undefined)

Create a window with:
 * `id` - the window id
 * `type` - this can be a string or a numeric id depending on the mcVersion
 * `title` - the title of the window
 * `slotCount` - used to set the number of slots for mcVersion prior to 1.14, ignored in 1.14

## windows.Window (base class)

### properties

#### window.id

The protocol id of the window

#### window.type

Type of the window, can be a string or a numeric id depending on the mcVersion

#### window.title

Title of the window, shown in the gui.

#### window.slots

Map of slot index to `Item` instance. `null` if the slot is empty.

#### window.inventoryStart

Slot from where the player inventory start in the window.

#### window.inventoryEnd

Slot from where the player inventory end in the window.

#### window.hotbarStart

Slot from where the player hotbar start in the window.

#### window.craftingResultSlot

Slot for the crafting result if this window has one, `-1` otherwise.

#### window.requiresConfirmation

`boolean` only false for chests in pre-1.14 versions.

#### window.selectedItem

In vanilla client, this is the item you are holding with the mouse cursor.

### Methods

#### window.acceptClick(click)

#### window.acceptOutsideWindowClick(click)

#### window.acceptInventoryClick(click)

#### window.acceptNonInventorySwapAreaClick(click)

#### window.acceptSwapAreaRightClick(click)

#### window.acceptSwapAreaLeftClick(click)

#### window.acceptCraftingClick(click)

Change the `slot` to contain the `newItem`. Emit the `updateSlot` events.

Returns a list of changed slots mirroring the [Window Click packet format](https://github.com/PrismarineJS/minecraft-data/blob/master/data/pc/1.17.1/protocol.json#L4831-L4852)

#### window.updateSlot(slot, newItem)

Change the `slot` to contain the `newItem`. Emit the `updateSlot` events.

#### window.findItemRange(start, end, itemType, metadata, [notFull], nbt)

 * `start` - start slot to begin the search from
 * `end` - end slot to end the search
 * `item` - numerical id that you are looking for [check the list](https://minecraft-data.prismarine.js.org/?d=items)
 * `metadata` -  metadata value that you are looking for. `null`
   means unspecified.
 * `notFull` - (optional) - if `true`, means that the returned
   item should not be at its `stackSize`.
 * `nbt` - nbt data for the item you are looking for. `null`
   means unspecified

#### window.findItemRangeName(start, end, itemName, metadata, [notFull])

 * `start` - start slot to begin the search from
 * `end` - end slot to end the search
 * `item` - name that you are looking for [check the list](https://minecraft-data.prismarine.js.org/?d=items)
 * `metadata` -  metadata value that you are looking for. `null`
   means unspecified.
 * `notFull` - (optional) - if `true`, means that the returned
   item should not be at its `stackSize`.

#### window.findInventoryItem(item, metadata, [notFull])

Search in the player inventory.

 * `item` - numerical id or name that you are looking for [check the list](https://minecraft-data.prismarine.js.org/?d=items)
 * `metadata` -  metadata value that you are looking for. `null`
   means unspecified.
 * `notFull` - (optional) - if `true`, means that the returned
   item should not be at its `stackSize`.

#### window.findContainerItem(item, metadata, [notFull])

Search in the container of the window.

 * `item` - numerical id or name that you are looking for [check the list](https://minecraft-data.prismarine.js.org/?d=items)
 * `metadata` -  metadata value that you are looking for. `null`
   means unspecified.
 * `notFull` - (optional) - if `true`, means that the returned
   item should not be at its `stackSize`.

#### window.firstEmptySlotRange(start, end)

Return the id of the first empty slot between `start` and `end`.

#### window.firstEmptyHotbarSlot()

Return the id of the first empty slot in the hotbar.

#### window.firstEmptyContainerSlot()

Return the id of the first empty slot in the container.

#### window.firstEmptyInventorySlot(hotbarFirst = true)

Return the id of the first empty slot in the inventory, start looking in the hotbar first if the flag is set.

#### window.countRange (start, end, itemType, metadata)

Returns how many item you have of the given type, between slots `start` and `end`.

 * `itemType` - numerical id that you are looking for
 * `metadata` - (optional) metadata value that you are looking for.
   defaults to unspecified

#### window.itemsRange (start, end)

Returns a list of `Item` instances between slots `start` and `end`.

#### window.count(itemType, [metadata])

Returns how many you have in the inventory section of the window.

 * `itemType` - numerical id that you are looking for
 * `metadata` - (optional) metadata value that you are looking for.
   defaults to unspecified

#### window.items()

Returns a list of `Item` instances from the inventory section of the window.

#### window.containerCount(itemType, [metadata])

Returns how many you have in the top section of the window.

 * `itemType` - numerical id that you are looking for
 * `metadata` - (optional) metadata value that you are looking for.
   defaults to unspecified

#### window.containerItems()

Returns a list of `Item` instances from the top section of the window.

#### window.emptySlotCount()

Returns how many empty slots you have in the inventory section of the window.

#### window.transactionRequiresConfirmation(click)

Returns the property: `requiresConfirmation`.

#### window.clear([blockId], [count])

Sets all slots in the window to null (unless specified by args)

+ `blockId` - (optional) numerical id of the block that you would like to clear
+ `count` - (optional, requires blockId) only delete this number of the given block

### Events

#### window "updateSlot" (slot, oldItem, newItem)

Fired whenever any slot in the window changes for any reason.
Watching `bot.inventory.on("updateSlot")` is the best way to watch for changes in your inventory.

 * `slot` - index of changed slot.
 * `oldItem`, `newItem` - either an [`Item`](#mineflayeritem) instance or `null`.

`newItem === window.slots[slot]`.

#### window "updateSlot:slot" (oldItem, newItem)

Fired whenever a specific slot in the window changes for any reason.

 * `oldItem`, `newItem` - either an [`Item`](#mineflayeritem) instance or `null`.

`newItem === window.slots[slot]`.
