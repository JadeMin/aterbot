declare module 'prismarine-nbt'{
  export type List<T extends TagType> = {
    type: TagType.List,
    value: { type: Tags[T]['type'], value: Tags[T]['value'][] }
  };

  export enum TagType {
    Byte = 'byte',
    Short = 'short',
    Int = 'int',
    Long = 'long',
    Float = 'float',
    Double = 'double',
    ByteArray = 'byteArray',
    String = 'string',
    List = 'list',
    Compound = 'compound',
    IntArray = 'intArray',
    LongArray = 'longArray',
  }

  export type Tags = {
    [TagType.Byte]: { type: TagType.Byte, value: number };
    [TagType.Short]: { type: TagType.Short, value: number };
    [TagType.Int]: { type: TagType.Int, value: number };
    [TagType.Long]: { type: TagType.Long, value: [number, number] };
    [TagType.Float]: { type: TagType.Float, value: number };
    [TagType.Double]: { type: TagType.Double, value: number };
    [TagType.ByteArray]: { type: TagType.ByteArray, value: number[] };
    [TagType.String]: { type: TagType.String, value: string };
    [TagType.List]: List<TagType>
    [TagType.Compound]: { type: TagType.Compound, value: Record<string, undefined | Tags[TagType]> };
    [TagType.IntArray]: { type: TagType.IntArray, value: number[] };
    [TagType.LongArray]: { type: TagType.LongArray, value: [number, number][] };
  }

  export type NBTFormat = 'big' | 'little' | 'littleVarint'

  export type NBT = Tags['compound'] & {name: string};
  export type Metadata = {
    // The decompressed buffer
    buffer: Buffer
    // The length of bytes read from the buffer
    size: number
  }
  export function writeUncompressed(value: NBT, format?: NBTFormat): Buffer;
  export function parseUncompressed(value: Buffer, format?: NBTFormat): NBT;
  
  export function parse(data: Buffer, nbtType?: NBTFormat): Promise<{parsed: NBT, type: NBTFormat, metadata: Metadata}>;
  export function simplify(data: Tags[TagType]): any
  // ProtoDef compiled protocols
  export const protos: { big: any, little: any, littleVarint: any };
  // Big Endian protocol
  export const proto: any;
  // Little Endian protocol
  export const protoLE: any;

  /** @deprecated */
  export function writeUncompressed(value: NBT, little?: boolean): Buffer;
  /** @deprecated */
  export function parseUncompressed(value: Buffer, little?: boolean): NBT;
  /** @deprecated */
  export function parse(data: Buffer, little: boolean, callback: (err: Error | null, value: NBT) => any): void;
  /** @deprecated */
  export function parse(data: Buffer, nbtType: NBTFormat, callback: (err: Error | null, value: NBT) => any): void;
  /** @deprecated */
  export function parse(data: Buffer, callback: (err: Error | null, value: NBT) => any): void;

  export function bool(val: number): { type: 'short', value: number }
  export function short (val: number): { type: 'short', value: number }
  export function byte<T extends number> (val: number): { type: 'byte', value: number }
  export function string<T extends string | string[]> (val: T): { type: 'string', value: T }
  export function comp<T extends object | object[]> (val: T, name?: string): { type: 'compound', name?: string, value: T }
  export function int<T extends number | number[]> (val: T): { type: 'int', value: T }
  export function list<T extends string, K extends {type: T}>(value: K): { type: 'list'; value: { type: T | 'end', value: K } }
  export function float<T extends number | number[]> (value: T): { type: 'float', value: T}
  export function double<T extends number | number[]> (value: T): { type: 'double', value: T}
  /**
   * @param value Takes a BigInt or an array of two 32-bit integers
   */
  export function long<T extends number | number[] |  BigInt> (value: T): { type: 'long', value: T}
  // Arrays
  export function byteArray (value: number[]): { type: 'byteArray', value: number[]}
  export function shortArray (value: number[]): { type: 'shortArray', value: number[]}
  export function intArray (value: number[]): { type: 'intArray', value: number[]}
  export function longArray<T extends number[] | BigInt[]> (value: T): { type: 'longArray', value: T}
}
