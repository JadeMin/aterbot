import type Mineflayer from 'mineflayer';



export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;

export type Bot<Ready extends boolean = boolean> = & If<Ready, Mineflayer.Bot>;