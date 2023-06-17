import { copyFile } from 'node:fs/promises';
import { watchFile } from 'node:fs';

const assets = [{
	src: "./src/index.html",
	dest: "./dist/index.html"
}] as const;



export const buildAssets = async (): Promise<void> => {
	await Promise.all(
		assets.map(async asset => {
			return await copyFile(asset.src, asset.dest);
		})
	);
	return;
};

export const watchAssets = async (): Promise<void> => {
	await buildAssets();
	assets.map(asset => {
		watchFile(asset.src, buildAssets);
	});
	return;
};