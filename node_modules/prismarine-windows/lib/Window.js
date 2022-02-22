const assert = require('assert')
const EventEmitter = require('events').EventEmitter

module.exports = (Item) => {
  return class Window extends EventEmitter {
    constructor (id, type, title, slotCount,
      inventorySlotsRange = { start: 27, end: 62 },
      craftingResultSlot = -1,
      requiresConfirmation = true) {
      super()
      this.id = id
      this.type = type
      this.title = title
      this.slots = new Array(slotCount).fill(null)
      this.inventoryStart = inventorySlotsRange.start
      this.inventoryEnd = inventorySlotsRange.end + 1
      this.hotbarStart = this.inventoryEnd - 9
      this.craftingResultSlot = craftingResultSlot
      this.requiresConfirmation = requiresConfirmation
      // in vanilla client, this is the item you are holding with the
      // mouse cursor
      this.selectedItem = null
    }

    acceptClick (click) {
      assert.ok(click.mouseButton === 0 || click.mouseButton === 1)
      if (click.slot === -999) {
        return this.acceptOutsideWindowClick(click)
      } else if (click.slot >= this.inventoryStart && click.slot < this.inventoryEnd) {
        return this.acceptInventoryClick(click)
      } else if (click.slot === this.craftingResultSlot) {
        return this.acceptCraftingClick(click)
      } else {
        return this.acceptNonInventorySwapAreaClick(click)
      }
    }

    acceptOutsideWindowClick (click) {
      assert.strictEqual(click.mode, 0, 'unimplemented')
      if (click.mouseButton === 0) {
        this.selectedItem = null
      } else if (click.mouseButton === 1) {
        this.selectedItem.count -= 1
        if (!this.selectedItem.count) this.selectedItem = null
      } else {
        assert.ok(false, 'unimplemented')
      }
      return []
    }

    acceptInventoryClick (click) {
      if (click.mouseButton === 0) {
        if (click.mode > 0) {
          assert.ok(false, 'unimplemented')
        } else {
          return this.acceptSwapAreaLeftClick(click)
        }
      } else if (click.mouseButton === 1) {
        return this.acceptSwapAreaRightClick(click)
      } else {
        assert.ok(false, 'unimplemented')
      }
    }

    acceptNonInventorySwapAreaClick (click) {
      assert.strictEqual(click.mode, 0, 'unimplemented')
      if (click.mouseButton === 0) {
        return this.acceptSwapAreaLeftClick(click)
      } else if (click.mouseButton === 1) {
        return this.acceptSwapAreaRightClick(click)
      } else {
        assert.ok(false, 'unimplemented')
      }
    }

    acceptSwapAreaRightClick (click) {
      assert.strictEqual(click.mouseButton, 1)
      assert.strictEqual(click.mode, 0)

      const { item } = click
      if (this.selectedItem) {
        if (item) {
          if (item.type === this.selectedItem.type &&
            item.metadata === this.selectedItem.metadata) {
            item.count += 1
            this.selectedItem.count -= 1
            if (this.selectedItem.count === 0) this.selectedItem = null
          } else {
            // swap selected item and window item
            this.updateSlot(click.slot, this.selectedItem)
            this.selectedItem = item
          }
        } else {
          if (this.selectedItem.count === 1) {
            this.updateSlot(click.slot, this.selectedItem)
            this.selectedItem = null
          } else {
            this.updateSlot(click.slot, new Item(this.selectedItem.type, 1,
              this.selectedItem.metadata, this.selectedItem.nbt))
            this.selectedItem.count -= 1
          }
        }
      } else if (item) {
        // grab 1/2 of item
        this.selectedItem = new Item(item.type, Math.ceil(item.count / 2),
          item.metadata, item.nbt)
        item.count -= this.selectedItem.count
        if (item.count === 0) this.updateSlot(item.slot, null)
      }
      return [{
        location: click.slot,
        item: Item.toNotch(this.slots[click.slot])
      }]
    }

    acceptSwapAreaLeftClick (click) {
      assert.strictEqual(click.mouseButton, 0)
      assert.strictEqual(click.mode, 0)

      const { item } = click
      if (item && this.selectedItem &&
        item.type === this.selectedItem.type &&
        item.metadata === this.selectedItem.metadata) {
        // drop as many held item counts into the slot as we can
        const newCount = item.count + this.selectedItem.count
        const leftover = newCount - item.stackSize
        if (leftover <= 0) {
          item.count = newCount
          this.selectedItem = null
        } else {
          item.count = item.stackSize
          this.selectedItem.count = leftover
        }
      } else {
        // swap selected item and window item
        const tmp = this.selectedItem
        this.selectedItem = item
        this.updateSlot(click.slot, tmp)
      }
      return [{
        location: click.slot,
        item: Item.toNotch(this.slots[click.slot])
      }]
    }

    updateSlot (slot, newItem) {
      if (newItem) newItem.slot = slot
      const oldItem = this.slots[slot]
      this.slots[slot] = newItem

      this.emit('updateSlot', slot, oldItem, newItem)
      this.emit(`updateSlot:${slot}`, oldItem, newItem)
    }

    findItemRange (start, end, itemType, metadata, notFull, nbt) {
      assert.notStrictEqual(itemType, null)
      for (let i = start; i < end; ++i) {
        const item = this.slots[i]
        if (
          item && itemType === item.type &&
          (metadata == null || metadata === item.metadata) &&
          (!notFull || item.count < item.stackSize) &&
          (nbt == null || JSON.stringify(nbt) === JSON.stringify(item.nbt))) {
          return item
        }
      }
      return null
    }

    findItemRangeName (start, end, itemName, metadata, notFull) {
      assert.notStrictEqual(itemName, null)
      for (let i = start; i < end; ++i) {
        const item = this.slots[i]
        if (item && itemName === item.name &&
          (metadata == null || metadata === item.metadata) &&
          (!notFull || item.count < item.stackSize)) {
          return item
        }
      }
      return null
    }

    findInventoryItem (item, metadata, notFull) {
      assert(typeof item === 'number' || typeof item === 'string' || typeof item === 'undefined', 'No valid type given')
      return typeof item === 'number'
        ? this.findItemRange(this.inventoryStart, this.inventoryEnd, item, metadata, notFull)
        : this.findItemRangeName(this.inventoryStart, this.inventoryEnd, item, metadata, notFull)
    }

    findContainerItem (item, metadata, notFull) {
      assert(typeof item === 'number' || typeof item === 'string' || typeof item === 'undefined', 'No valid type given')
      return typeof item === 'number'
        ? this.findItemRange(0, this.inventoryStart, item, metadata, notFull)
        : this.findItemRangeName(0, this.inventoryStart, item, metadata, notFull)
    }

    firstEmptySlotRange (start, end) {
      for (let i = start; i < end; ++i) {
        if (!this.slots[i]) return i
      }
      return null
    }

    firstEmptyHotbarSlot () {
      return this.firstEmptySlotRange(this.hotbarStart, this.inventoryEnd)
    }

    firstEmptyContainerSlot () {
      return this.firstEmptySlotRange(0, this.inventoryStart)
    }

    firstEmptyInventorySlot (hotbarFirst = true) {
      if (hotbarFirst) {
        const slot = this.firstEmptyHotbarSlot()
        if (slot !== null) return slot
      }
      return this.firstEmptySlotRange(this.inventoryStart, this.inventoryEnd)
    }

    countRange (start, end, itemType, metadata) {
      let sum = 0
      for (let i = start; i < end; ++i) {
        const item = this.slots[i]
        if (item && itemType === item.type &&
          (metadata == null || item.metadata === metadata)) {
          sum += item.count
        }
      }
      return sum
    }

    itemsRange (start, end) {
      const results = []
      for (let i = start; i < end; ++i) {
        const item = this.slots[i]
        if (item) results.push(item)
      }
      return results
    }

    count (itemType, metadata) {
      itemType = parseInt(itemType, 10) // allow input to be string
      return this.countRange(this.inventoryStart, this.inventoryEnd, itemType, metadata)
    }

    items () {
      return this.itemsRange(this.inventoryStart, this.inventoryEnd)
    }

    containerCount (itemType, metadata) {
      itemType = parseInt(itemType, 10) // allow input to be string
      return this.countRange(0, this.inventoryStart, itemType, metadata)
    }

    containerItems () {
      return this.itemsRange(0, this.inventoryStart)
    }

    emptySlotCount () {
      let count = 0
      for (let i = this.inventoryStart; i < this.inventoryEnd; ++i) {
        if (!this.slots[i]) count += 1
      }
      return count
    }

    transactionRequiresConfirmation (click) {
      return this.requiresConfirmation
    }

    acceptCraftingClick (click) {
      assert.strictEqual(click.mouseButton, 0)
      assert.strictEqual(click.mode, 0)
      assert.strictEqual(this.selectedItem, null)
      return this.acceptNonInventorySwapAreaClick(click)
    }

    clear (blockId, count) {
      let clearedCount = 0

      const iterLoop = (currSlot) => {
        if (!currSlot || (blockId && currSlot.type !== blockId)) return false
        const blocksNeeded = count - clearedCount
        if (count && currSlot.count > blocksNeeded) { // stack is bigger then needed
          clearedCount += blocksNeeded
          this.updateSlot(currSlot.slot, new Item(blockId, currSlot.count - blocksNeeded, currSlot.metadata, currSlot.nbt))
        } else { // stack is just big enough or too little items to finish counter
          clearedCount += currSlot.count
          this.updateSlot(currSlot.slot, null)
        }
        if (count === clearedCount) return true // we have enough items
        return false
      }

      for (let i = this.inventoryEnd; i > this.hotbarStart - 1; i--) {
        if (iterLoop(this.slots[i])) break
      }

      if (clearedCount !== count) {
        for (let i = this.inventoryStart; i < this.hotbarStart; i++) {
          if (iterLoop(this.slots[i])) break
        }
      }

      return clearedCount
    }
  }
}
