export interface Version {
  // Returns true if the current version is greater than or equal to the `other` version's dataVersion
  ['>='](other: string): boolean
  // Returns true if the current version is greater than the `other` version's dataVersion
  ['>'](other: string): boolean
  // Returns true if the current version is less than the `other` version's dataVersion
  ['<'](other: string): boolean
  // Returns true if the current version is less than than or equal to the `other` version's dataVersion
  ['<='](other: string): boolean
  // Returns true if the current version is equal to the `other` version's dataVersion
  ['=='](other: string): boolean
  type: 'pc' | 'bedrock'
}

export interface VersionSet {
  pc: { [version: string]: Version }
  bedrock: { [version: string]: Version }
}

export interface SupportedVersions {
  pc: string[]
  bedrock: string[]
}

export interface Schemas {
  biomes: object
  blocks: object
  effects: object
  entities: object
  instruments: object
  items: object
  materials: object
  protocol: object
  protocolVersions: object
  recipes: object
  version: object
  windows: object
  foods: object
  blockLoot: object
  entityLoot: object
}

export interface LoginPacket {
  entityId: number

  /**
   * introduced in Minecraft 1.16.2
   */
  isHardcore?: boolean

  gameMode: number

  /**
   * Introduced in Minecraft 1.17
   */
  previousGameMode?: number
  /**
   * Introduced in Minecraft 1.17
   */
  worldNames?: string[]
  /**
   * Introduced in Minecraft 1.17
   */
  dimensionCodec?: object

  dimension: object

  /**
   * Introduced in Minecraft 1.17
   */
  worldName?: string

  hashedSeed: number
  maxPlayers: number
  viewDistance: number

  /**
   * Introduced in Minecraft 1.18
   */
  simulationDistance?: number

  reducedDebugInfo: boolean
  enableRespawnScreen: boolean

  /**
   * Introduced in Minecraft 1.17
   */
  isDebug?: boolean
  /**
   * Introduced in Minecraft 1.17
   */
  isFlat?: boolean
}

export interface IndexedData {
  isOlderThan(version: string): boolean
  isNewerOrEqualTo(version: string): boolean
  
  blocks: { [id: number]: Block }
  blocksByName: { [name: string]: Block }
  blocksByStateId: { [id: number]: Block }
  blocksArray: Block[]
  /**
   * Bedrock edition only
   */
  blockStates?: { name: string; states: object; version: number }[]
  blockCollisionShapes: { blocks: { [name: string]: number[] }; shapes: { [id: number]: [number[]] } }

  loginPacket: LoginPacket

  items: { [id: number]: Item }
  itemsByName: { [name: string]: Item }
  itemsArray: Item[]

  foods: { [id: number]: Food }
  foodsByName: { [name: string]: Food }
  foodsArray: Food[]

  biomes: { [id: number]: Biome }
  biomesArray: Biome[]
  biomesByName: { [name: string]: Biome }

  recipes: { [id: number]: Recipe[] }

  instruments: { [id: number]: Instrument }
  instrumentsArray: Instrument[]

  materials: { [name: string]: Material }

  mobs: { [id: number]: Entity }
  objects: { [id: number]: Entity }
  entities: { [id: number]: Entity }
  entitiesByName: { [name: string]: Entity }
  entitiesArray: Entity[]

  enchantments: { [id: number]: Enchantment }
  enchantmentsByName: { [name: string]: Enchantment }
  enchantmentsArray: Enchantment[]

  /**
   * Bedrock edition only
   */
  defaultSkin?: object

  protocol: object
  protocolComments: object
  /**
   * Bedrock edition only
   */
  protocolYaml?: string[]

  windows: { [id: string]: Window }
  windowsByName: { [name: string]: Window }
  windowsArray: Window[]

  effects: { [id: number]: Effect }
  effectsByName: { [name: string]: Effect }
  effectsArray: Effect[]

  particles: { [id: number]: Particle }
  particlesByName: { [name: string]: Particle }
  particlesArray: Particle[]

  attributes: { [resource: string]: string }
  attributesByName: { [name: string]: string }
  attributesArray: []

  commands: {}

  version: Version

  type: 'pc' | 'bedrock'

  language: { [key: string]: string }

  blockLoot: { [id: number]: BlockLoot }
  blockLootByName: { [name: string]: BlockLoot }

  entityLoot: { [id: number]: EntityLoot }
  entityLootByName: { [name: string]: EntityLoot }

  mapIcons: { [id: number]: MapIcon }
  mapIconsByName: { [name: string]: MapIcon }
  mapIconsArray: MapIcon[]

  tints: Tints
}

const versions: {
  [key in keyof SupportedVersions]: Version[]
}
const versionsByMinecraftVersion: VersionSet
const preNettyVersionsByProtocolVersion: VersionSet
const postNettyVersionsByProtocolVersion: VersionSet
const supportedVersions: SupportedVersions
const legacy: { pc: { blocks: { [id: string]: string } } }
const schemas: Schemas
