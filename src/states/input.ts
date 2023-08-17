import { atom } from 'recoil';



export const errorState = atom<boolean>({
	key: "error",
	default: false
});

export const hostState = atom<string>({
	key: "host",
	default: ''
});

export const portState = atom<string>({
	key: "port",
	default: ''
});

export const usernameState = atom<string>({
	key: "username",
	default: ''
});