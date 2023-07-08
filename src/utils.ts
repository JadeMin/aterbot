export const sleep = (ms: number): Promise<number> => new Promise(resovle => setTimeout(resovle, ms));

export const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];