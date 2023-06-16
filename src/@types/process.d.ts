export {};

// Polyfill for Repl.it env
declare global {
	namespace NodeJS {
		interface Process {
			readonly PORT?: number;
		}
	}
}