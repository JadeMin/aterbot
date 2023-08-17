import { atom } from 'recoil';



export const errorState = atom<boolean>({
	key: "errorState",
	default: false
});

export const hostState = atom<string>({
	key: "hostState",
	default: ''
});

export const portState = atom<string>({
	key: "portState",
	default: ''
});

export const usernameState = atom<string>({
	key: "usernameState",
	default: ''
});