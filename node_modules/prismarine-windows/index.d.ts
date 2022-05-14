/// <reference types="node" />
/// <reference types="prismarine-item" />

import {EventEmitter} from 'events';
import {Item} from 'prismarine-item';

export class Window extends EventEmitter {
    constructor (id: number, type: number | string, title: string, slotCount: number, inventorySlotsRange: { start: number, end: number }, craftingResultSlot: number, requiresConfirmation: boolean);

    /**
     * The protocol id of the window
     */
    id: number;

    /**
     * Type of the window, can be a string or a numeric id depending on the mcVersion
     */
    type: number | string;

    /**
     * Title of the window, shown in the gui
     */
    title: string;

    /**
     * Map of slot index to Item instance. null if the slot is empty
     */
    slots: Array<Item>;

    /**
     * Slot from where the player inventory start in the window
     */
    inventoryStart: number;

    /**
     * Slot from where the player inventory end in the window
     */
    inventoryEnd: number;

    /**
     * Slot from where the player hotbar start in the window.
     */
    hotbarStart: number;

    /**
     * Slot for the crafting result if this window has one, -1 otherwise.
     */
    craftingResultSlot: number;

    /**
     * boolean only false for chests in pre-1.14 versions.
     */
    requiresConfirmation: boolean;

    /**
     * In vanilla client, this is the item you are holding with the mouse cursor.
     */
    selectedItem: Item | null;

    acceptClick(click: Click): void;
    acceptOutsideWindowClick(click: Click): void;
    acceptInventoryClick(click: Click): void;
    acceptNonInventorySwapAreaClick(click: Click): void;
    acceptNonInventorySwapAreaClick(click: Click): void;
    acceptSwapAreaLeftClick(click: Click): void;
    acceptSwapAreaRightClick(click: Click): void;
    acceptCraftingClick(click: Click): void;

    /**
     * Change the slot to contain the newItem. Emit the updateSlot events.
     * @param slot {number}
     * @param newItem {Item}
     */
    updateSlot(slot: number, newItem: Item): void;

    /**
     * @param start start slot to begin the search from
     * @param end end slot to end the search
     * @param itemType numerical id that you are looking for
     * @param metadata metadata value that you are looking for. null means unspecified
     * @param notFull (optional) - if true, means that the returned item should not be at its stackSize
     * @param nbt nbt data for the item you are looking for. null means unspecified
     */
    findItemRange(start: number, end: number, itemType: number, metadata: number | null, notFull: boolean, nbt: any): Item | null;

    /**
     * @param start start slot to begin the search from
     * @param end end slot to end the search
     * @param itemName name that you are looking for
     * @param metadata metadata value that you are looking for. null means unspecified
     * @param notFull (optional) - if true, means that the returned item should not be at its stackSize
     */
    findItemRangeName(start: number, end: number, itemName: string, metadata: number | null, notFull: boolean): Item | null;

    /**
     * Search in the player inventory
     * @param itemType numerical id or name that you are looking for
     * @param metadata metadata value that you are looking for. null means unspecified
     * @param notFull (optional) - if true, means that the returned item should not be at its stackSize
     */
    findInventoryItem(itemType: number | string, metadata: number | null, notFull: boolean): Item | null;

    /**
     * Search in the container of the window
     * @param itemType numerical id or name that you are looking for
     * @param metadata metadata value that you are looking for. null means unspecified
     * @param notFull (optional) - if true, means that the returned item should not be at its stackSize
     */
    findContainerItem(itemType: number, metadata: number | null, notFull: boolean): Item | null

    /**
     * Return the id of the first empty slot between start and end
     * @param start
     * @param end
     */
    firstEmptySlotRange(start: number, end: number): number | null;

    /**
     * Return the id of the first empty slot in the hotbar
     */
    firstEmptyHotbarSlot(): number | null

    /**
     * Return the id of the first empty slot in the container
     */
    firstEmptyContainerSlot() : number | null;

    /**
     * Return the id of the first empty slot in the inventory, start looking in the hotbar first if the flag is set
     * @param hotbarFirst DEFAULT: true
     */
    firstEmptyInventorySlot(hotbarFirst?: boolean): number | null;

    /**
     * Returns how many item you have of the given type, between slots start and end
     * @param start
     * @param end
     * @param itemType numerical id that you are looking for
     * @param metadata (optional) metadata value that you are looking for. defaults to unspecified
     */
    countRange(start: number, end: null, itemType: number, metadata: number | null): number;

    /**
     * Returns a list of Item instances between slots start and end
     * @param start
     * @param end
     */
    itemsRange(start: number, end: number): Array<Item>;

    /**
     * Returns how many you have in the inventory section of the window
     * @param itemType numerical id that you are looking for
     * @param metadata (optional) metadata value that you are looking for. defaults to unspecified
     */
    count(itemType: number | string, metadata: number | null): number;

    /**
     * Returns a list of Item instances from the inventory section of the window
     */
    items(): Array<Item>;

    /**
     * Returns how many you have in the top section of the window
     * @param itemType numerical id that you are looking for
     * @param metadata (optional) metadata value that you are looking for. defaults to unspecified
     */
    containerCount(itemType: number, metadata: number | null): number;

    /**
     * Returns a list of Item instances from the top section of the window
     */
    containerItems(): Array<Item>

    /**
     * Returns how many empty slots you have in the inventory section of the window
     */
    emptySlotCount(): number;

    /**
     * Returns the property: requiresConfirmation
     * @param click
     */
    transactionRequiresConfirmation(click?: Click): boolean;

    /**
     * Sets all slots in the window to null (unless specified by args)
     * @param blockId (optional) numerical id of the block that you would like to clear
     * @param count (optional, requires blockId) only delete this number of the given block
     */
    clear(blockId?: number, count?: number): void;
}
export interface Click {
    mode: number;
    mouseButton: number;
    slot: number;
}
export interface WindowInfo {
    type: number | string;
    inventory: { start: number, end: number };
    slots: number;
    craft: number;
    requireConfirmation: boolean;
}

export interface WindowsExports {
    createWindow(id: number, type: number | string, title: string, slotCount?: number): Window;
    Window: typeof Window;
    windows: {[key in WindowName]: WindowInfo};
}

export declare function loader(mcVersion: string): WindowsExports;

export default loader;

export type WindowName = 
    'minecraft:inventory' |
    'minecraft:generic_9x1' |
    'minecraft:generic_9x2' |
    'minecraft:generic_9x3' |
    'minecraft:generic_9x4' |
    'minecraft:generic_9x5' |
    'minecraft:generic_9x6' |
    'minecraft:generic_3x3' |
    'minecraft:anvil' |
    'minecraft:beacon' |
    'minecraft:blast_furnace' |
    'minecraft:brewing_stand' |
    'minecraft:crafting' |
    'minecraft:enchantment' |
    'minecraft:furnace' |
    'minecraft:grindstone' |
    'minecraft:hopper' |
    'minecraft:lectern' |
    'minecraft:loom' |
    'minecraft:merchant' |
    'minecraft:shulker_box' |
    'minecraft:smithing' |
    'minecraft:smoker' |
    'minecraft:cartography' |
    'minecraft:stonecutter'
