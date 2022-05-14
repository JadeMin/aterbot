// This will interface will merge with the generated one
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
    pc: { [version: string]: Version };
    bedrock: { [version: string]: Version };
}

export interface SupportedVersions {
    pc: string[];
    bedrock: string[];
}

export interface Schemas {
    biomes: any;
    blocks: any;
    effects: any;
    entities: any;
    instruments: any;
    items: any;
    materials: any;
    protocol: any;
    protocolVersions: any;
    recipes: any;
    version: any;
    windows: any;
    foods: any;
    blockLoot: any;
    entityLoot: any;
}

export interface LoginPacket {
    entityId: number;

    /**
     * introduced in Minecraft 1.16.2
     */
    isHardcore?: boolean;

    gameMode: number;

    /**
     * Introduced in Minecraft 1.17
     */
    previousGameMode?: number;
    /**
     * Introduced in Minecraft 1.17
     */
    worldNames?: string[];
    /**
     * Introduced in Minecraft 1.17
     */
    dimensionCodec?: any;

    dimension: any;

    /**
     * Introduced in Minecraft 1.17
     */
    worldName?: string;

    hashedSeed: number;
    maxPlayers: number;
    viewDistance: number;

    /**
     * Introduced in Minecraft 1.18
     */
    simulationDistance?: number;

    reducedDebugInfo: boolean;
    enableRespawnScreen: boolean;

    /**
     * Introduced in Minecraft 1.17
     */
    isDebug?: boolean;    
    /**
     * Introduced in Minecraft 1.17
     */
    isFlat?: boolean;
}

export interface IndexedData {
    isNewerOrEqualTo(version: string): boolean;
    isOlderThan(version: string): boolean;
    blocks: { [id: number]: Block; };
    blocksByName: { [name: string]: Block; };
    blocksArray: Block[];

    loginPacket: LoginPacket;

    items: { [id: number]: Item; };
    itemsByName: { [name: string]: Item; };
    itemsArray: Item[];

    foods: { [id: number]: Food; };
    foodsByName: { [name: string]: Food; };
    foodsArray: Food[];
    foodsByFoodPoints: { [foodPoints: number]: Food; };
    foodsBySaturation: { [saturation: number]: Food; };

    biomes: { [id: number]: Biome; };
    biomesArray: Biome[];
    biomesByName: { [name: string]: Biome; };

    recipes: { [id: number]: Recipe[]; };

    instruments: { [id: number]: Instrument; };
    instrumentsArray: Instrument[];

    materials: { [name: string]: Material };

    mobs: { [id: number]: Entity; };
    objects: { [id: number]: Entity; };
    entitiesByName: { [name: string]: Entity; };
    entitiesArray: Entity[];

    enchantments: { [id: number]: Enchantment; };
    enchantmentsByName: { [name: string]: Enchantment; };
    enchantmentsArray: Enchantment[];

    protocol: any;
    protocolComments: any;

    windows: { [id: number]: Window; };
    windowsByName: { [name: string]: Window; };
    windowsArray: Window[];

    effects: { [id: number]: Effect; };
    effectsByName: { [name: string]: Effect; };
    effectsArray: Effect[];

    attributes: { [resource: string]: string; };
    attributesByName: { [name: string]: string; };
    attributesArray: [];

    version: Version;

    type: string;

    language: { [key: string]: string };

    blockLoot: { [id: number]: BlockLoot; };
    blockLootByName: { [name: string]: BlockLoot; };

    entityLoot: { [id: number]: EntityLoot; };
    entityLootByName: { [name: string]: EntityLoot; };
}

const versions: {
    [key in keyof SupportedVersions]: Version[];
  };
const versionsByMinecraftVersion: VersionSet;
const preNettyVersionsByProtocolVersion: VersionSet;
const postNettyVersionsByProtocolVersion: VersionSet;
const supportedVersions: SupportedVersions;
const schemas: Schemas;
