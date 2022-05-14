module.exports = loader
module.exports.testedVersions = ['1.8.8', '1.9.4', '1.10.2', '1.11.2', '1.12.2', '1.13.2', '1.14.4', '1.15.2', '1.16.4', '1.17.1', '1.18.1', 'bedrock_1.17.10', 'bedrock_1.18.0']

const nbt = require('prismarine-nbt')
const mcData = require('minecraft-data')
const legacyPcBlocksByName = Object.entries(mcData.legacy.pc.blocks).reduce((obj, [idmeta, name]) => {
  const n = name.replace('minecraft:', '').split('[')[0]
  const s = name.split('[')[1]?.replace(']', '') ?? ''
  ;(obj[n] = obj[n] || {})[s] = idmeta
  return obj // array of { [name]: { [states string]: string(id:meta) } }
}, {})
const legacyPcBlocksByIdmeta = Object.entries(mcData.legacy.pc.blocks).reduce((obj, [idmeta, name]) => {
  const s = name.split('[')[1]?.replace(']', '')
  obj[idmeta] = s
    ? Object.fromEntries(s.split(',').map(s => {
        let [k, v] = s.split('=')
        if (!isNaN(parseInt(v))) v = parseInt(v)
        return [k, v]
      }))
    : {}
  return obj // array of { '255:0': { mode: 'save' }, }
}, {})

function loader (registryOrVersion) {
  const registry = typeof registryOrVersion === 'string' ? require('prismarine-registry')(registryOrVersion) : registryOrVersion
  const mcVersion = registry.version.type === 'bedrock' ? 'bedrock_' + registry.version.majorVersion : registry.version.minecraftVersion // until prismarine-biome supports registry

  const version = registry.version
  const features = {
    usesBlockStates: (version.type === 'pc' && version['>=']('1.13')) || (version.type === 'bedrock'),
    effectNamesMatchRegistryName: version['>=']('1.17')
  }

  return provider(registry, { Biome: require('prismarine-biome')(mcVersion), features, version })
}

function provider (registry, { Biome, version, features }) {
  const blockMethods = require('./blockEntity')(registry)
  const shapes = registry.blockCollisionShapes
  if (shapes) {
    // Prepare block shapes
    for (const id in registry.blocks) {
      const block = registry.blocks[id]
      const shapesId = shapes.blocks[block.name]
      block.shapes = (shapesId instanceof Array) ? shapes.shapes[shapesId[0]] : shapes.shapes[shapesId]
      if (block.states || version.type === 'bedrock') { // post 1.13
        if (shapesId instanceof Array) {
          block.stateShapes = []
          for (const i in shapesId) {
            block.stateShapes.push(shapes.shapes[shapesId[i]])
          }
        }
      } else { // pre 1.13
        if ('variations' in block) {
          for (const i in block.variations) {
            const metadata = block.variations[i].metadata
            if (shapesId instanceof Array) {
              block.variations[i].shapes = shapes.shapes[shapesId[metadata]]
            } else {
              block.variations[i].shapes = shapes.shapes[shapesId]
            }
          }
        }
      }

      if (!block.shapes && version.type === 'bedrock') {
        // if no shapes are present for this block (for example, some chemistry stuff we don't have BBs for), assume it's stone
        block.shapes = shapes.shapes[shapes.blocks.stone[0]]
        block.stateShapes = block.shapes
      }
    }
  }

  function getEffectLevel (effectName, effects) {
    const effectDescriptor = registry.effectsByName[effectName]
    if (!effectDescriptor) {
      return 0
    }
    const effectInfo = effects[effectDescriptor.id]
    if (!effectInfo) {
      return 0
    }
    return effectInfo.amplifier + 1
  }

  function getEnchantmentLevel (enchantmentName, enchantments) {
    const enchantmentDescriptor = registry.enchantmentsByName[enchantmentName]
    if (!enchantmentDescriptor) {
      return 0
    }

    for (const enchInfo of enchantments) {
      if (typeof enchInfo.name === 'string') {
        if (enchInfo.name.includes(enchantmentName)) {
          return enchInfo.lvl
        }
      } else if (enchInfo.name === enchantmentDescriptor.name) {
        return enchInfo.lvl
      }
    }
    return 0
  }

  function getMiningFatigueMultiplier (effectLevel) {
    switch (effectLevel) {
      case 0: return 1.0
      case 1: return 0.3
      case 2: return 0.09
      case 3: return 0.0027
      default: return 8.1E-4
    }
  }

  return class Block {
    constructor (type, biomeId, metadata, stateId) {
      this.type = type
      this.metadata = metadata
      this.light = 0
      this.skyLight = 0
      this.biome = new Biome(biomeId)
      this.position = null
      this.stateId = stateId
      this.computedStates = {}

      if (this.metadata == null) this.metadata = 0

      if (stateId === undefined && type !== undefined) {
        const b = registry.blocks[type]
        // Make sure the block is actually valid and metadata is within valid bounds
        this.stateId = b === undefined ? null : Math.min(b.minStateId + metadata, b.maxStateId)
      }

      const blockEnum = registry.blocksByStateId[this.stateId]
      if (blockEnum) {
        this.metadata = this.stateId - blockEnum.minStateId
        this.type = blockEnum.id
        this.name = blockEnum.name
        this.hardness = blockEnum.hardness
        this.displayName = blockEnum.displayName
        this.shapes = blockEnum.shapes
        if (blockEnum.stateShapes) {
          if (blockEnum.stateShapes[this.metadata] !== undefined) {
            this.shapes = blockEnum.stateShapes[this.metadata]
          } else {
            // Default to shape 0
            this.shapes = blockEnum.stateShapes[0]
            this.missingStateShape = true
          }
        } else if (blockEnum.variations) {
          const variations = blockEnum.variations
          for (const i in variations) {
            if (variations[i].metadata === metadata) {
              this.displayName = variations[i].displayName
              this.shapes = variations[i].shapes
            }
          }
        }
        this.boundingBox = blockEnum.boundingBox
        this.transparent = blockEnum.transparent
        this.diggable = blockEnum.diggable
        this.material = blockEnum.material
        this.harvestTools = blockEnum.harvestTools
        this.drops = blockEnum.drops
      } else {
        this.name = ''
        this.displayName = ''
        this.shapes = []
        this.hardness = 0
        this.boundingBox = 'empty'
        this.transparent = true
        this.diggable = false
      }

      this._properties = {}
      if (version.type === 'pc') {
        if (features.usesBlockStates) {
          const blockEnum = registry.blocksByStateId[this.stateId]
          if (blockEnum && blockEnum.states) {
            let data = this.metadata
            for (let i = blockEnum.states.length - 1; i >= 0; i--) {
              const prop = blockEnum.states[i]
              this._properties[prop.name] = propValue(prop, data % prop.num_values)
              data = Math.floor(data / prop.num_values)
            }
          }
        } else {
          this._properties = legacyPcBlocksByIdmeta[this.type + ':' + this.metadata] || legacyPcBlocksByIdmeta[this.type + ':0']
        }
      } else if (version.type === 'bedrock') {
        const states = registry.blockStates?.[this.stateId]?.states || {}
        for (const state in states) {
          this._properties[state] = states[state].value
        }
      }

      // This can be expanded to other non-sign related things
      if (this.name.includes('sign')) {
        mergeObject(this, blockMethods.sign)
      }
    }

    static fromStateId (stateId, biomeId) {
      // 1.13+: metadata is completely removed and only block state IDs are used
      if (features.usesBlockStates) {
        return new Block(undefined, biomeId, 0, stateId)
      } else {
        return new Block(stateId >> 4, biomeId, stateId & 15, stateId)
      }
    }

    static fromProperties (typeId, properties, biomeId) {
      const block = typeof typeId === 'string' ? registry.blocksByName[typeId] : registry.blocks[typeId]

      if (version.type === 'pc') {
        if (block.states) {
          let data = 0
          for (const [key, value] of Object.entries(properties)) {
            data += getStateValue(block.states, key, value)
          }
          return new Block(undefined, biomeId, 0, block.minStateId + data)
        } else {
          const states = legacyPcBlocksByName[block.name]
          for (const state in states) {
            let broke
            for (const [key, value] of Object.entries(properties)) {
              const s = key + '=' + value
              if (!state.includes(s)) {
                broke = true
                break
              }
            }
            if (!broke) {
              const [id, meta] = states[state].split(':').map(Number)
              return new Block(id, biomeId, meta)
            }
          }
          throw new Error('No matching block state found for ' + block.name + ' with properties ' + JSON.stringify(properties)) // This should not happen
        }
      } else if (version.type === 'bedrock') {
        for (let stateId = block.minStateId; stateId <= block.maxStateId; stateId++) {
          const state = registry.blockStates[stateId].states
          if (Object.entries(properties).find(([prop, val]) => state[prop]?.value !== val)) continue
          return new Block(undefined, biomeId, 0, stateId)
        }
        return block
      }
    }

    get blockEntity () {
      return this.entity ? nbt.simplify(this.entity) : undefined
    }

    getProperties () {
      return Object.assign(this._properties, this.computedStates)
    }

    canHarvest (heldItemType) {
      if (!this.harvestTools) { return true }; // for blocks harvestable by hand
      return heldItemType && this.harvestTools && this.harvestTools[heldItemType]
    }

    // http://minecraft.gamepedia.com/Breaking#Calculation
    // for more concrete information, look up following Minecraft methods (assuming yarn mappings):
    // AbstractBlock#calcBlockBreakingDelta, PlayerEntity#getBlockBreakingSpeed, PlayerEntity#canHarvest
    digTime (heldItemType, creative, inWater, notOnGround, enchantments = [], effects = {}) {
      if (creative) return 0

      const materialToolMultipliers = registry.materials[this.material]
      const isBestTool = heldItemType && materialToolMultipliers && materialToolMultipliers[heldItemType]

      // Compute breaking speed multiplier
      let blockBreakingSpeed = 1

      if (isBestTool) {
        blockBreakingSpeed = materialToolMultipliers[heldItemType]
      }

      // Efficiency is applied if tools speed multiplier is more than 1.0
      const efficiencyLevel = getEnchantmentLevel('efficiency', enchantments)
      if (efficiencyLevel > 0 && blockBreakingSpeed > 1.0) {
        blockBreakingSpeed += efficiencyLevel * efficiencyLevel + 1
      }

      // Haste is always considered when effect is present, and when both
      // Conduit Power and Haste are present, highest level is considered
      const hasteLevel = Math.max(
        getEffectLevel('Haste', effects),
        getEffectLevel('ConduitPower', effects))

      if (hasteLevel > 0) {
        blockBreakingSpeed *= 1 + (0.2 * hasteLevel)
      }

      // Mining fatigue is applied afterwards, but multiplier only decreases up to level 4
      const miningFatigueLevel = getEffectLevel('MiningFatigue', effects)

      if (miningFatigueLevel > 0) {
        blockBreakingSpeed *= getMiningFatigueMultiplier(miningFatigueLevel)
      }

      // Apply 5x breaking speed de-buff if we are submerged in water and do not have aqua affinity
      const aquaAffinityLevel = getEnchantmentLevel('aqua_affinity', enchantments)

      if (inWater && aquaAffinityLevel === 0) {
        blockBreakingSpeed /= 5.0
      }

      // We always get 5x breaking speed de-buff if we are not on the ground
      if (notOnGround) {
        blockBreakingSpeed /= 5.0
      }

      // Compute block breaking delta (breaking progress applied in a single tick)
      const blockHardness = this.hardness
      const matchingToolMultiplier = this.canHarvest(heldItemType) ? 30.0 : 100.0

      let blockBreakingDelta = blockBreakingSpeed / blockHardness / matchingToolMultiplier

      // Delta will always be zero if block has -1.0 durability
      if (blockHardness === -1.0) {
        blockBreakingDelta = 0.0
      }

      // We will never be capable of breaking block if delta is zero, so abort now and return infinity
      if (blockBreakingDelta === 0.0) {
        return Infinity
      }

      // If breaking delta is more than 1.0 per tick, the block is broken instantly, so return 0
      if (blockBreakingDelta >= 1.0) {
        return 0
      }

      // Determine how many ticks breaking will take, then convert to millis and return result
      // We round ticks up because if progress is below 1.0, it will be finished next tick

      const ticksToBreakBlock = Math.ceil(1.0 / blockBreakingDelta)
      return ticksToBreakBlock * 50
    }
  }

  function parseValue (value, state) {
    if (state.type === 'enum') {
      return state.values.indexOf(value)
    }
    if (state.type === 'bool') {
      if (value === true) return 0
      if (value === false) return 1
    }
    if (state.type === 'int') {
      return value
    }
    // Assume by-name mapping for unknown properties
    return state.values?.indexOf(value.toString()) ?? 0
  }

  function getStateValue (states, name, value) {
    let offset = 1
    for (let i = states.length - 1; i >= 0; i--) {
      const state = states[i]
      if (state.name === name) {
        return offset * parseValue(value, state)
      }
      offset *= state.num_values
    }
    return 0
  }

  function propValue (state, value) {
    if (state.type === 'enum') return state.values[value]
    if (state.type === 'bool') return !value
    return value
  }
}

function mergeObject (to, from) {
  Object.defineProperties(to, Object.getOwnPropertyDescriptors(from))
}
