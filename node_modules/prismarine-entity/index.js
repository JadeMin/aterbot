const Vec3 = require('vec3').Vec3
const EventEmitter = require('events').EventEmitter

module.exports = (version) => {
  const ChatMessage = require('prismarine-chat')(version)
  const Item = require('prismarine-item')(version)
  const mcData = require('minecraft-data')(version)
  class Entity extends EventEmitter {
    constructor (id) {
      super()
      this.id = id
      this.position = new Vec3(0, 0, 0)
      this.velocity = new Vec3(0, 0, 0)
      this.yaw = 0
      this.pitch = 0
      this.onGround = true
      this.height = 0
      this.width = 0
      this.effects = {}
      // 0 = held item, 1-4 = armor slot
      this.equipment = new Array(5)
      this.heldItem = this.equipment[0] // shortcut to equipment[0]
      this.isValid = true
      this.metadata = []
    }

    setEquipment (index, item) {
      this.equipment[index] = item
      this.heldItem = this.equipment[0]
    }

    getCustomName () {
      const name = this.metadata[2]
      if (name === undefined) {
        return null
      }
      return ChatMessage.fromNotch(name)
    }

    getDroppedItem () {
      if (this.name !== 'item' && this.name !== 'Item' && this.name !== 'item_stack') {
        return null // not a dropped item
      }
      return Item.fromNotch(this.metadata[mcData.supportFeature('metadataIxOfItem')])
    }
  }

  return Entity
}
