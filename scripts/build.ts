import type { BuildOptions } from 'esbuild';

import { build, context } from 'esbuild';

import { buildAssets, watchAssets } from "./buildAssets.ts";

const isDev =  process.argv.slice(2)[0] === "--dev";

const buildOption: BuildOptions = {
	entryPoints: ["./src/ts/index.tsx"],
	outdir: "./docs/",

	format: 'esm',

	bundle: true,
	treeShaking: true,
	minify: true,
	splitting: true,
	sourcemap: true
};



if(!isDev) {
	await build(buildOption);
	console.log("Build completed!");
	await buildAssets();
	console.log("Assets copied!");
} else {
	const contextResult = await context(buildOption);
	await contextResult.watch();
	console.log("Build completed and watching!");
	await watchAssets();
	console.log("Assets copied and watching!");

	const serveResult = await contextResult.serve({
		host: "localhost",
		port: 5500,
		servedir: "./docs/",
	});
	console.log(`Serving at http://${serveResult.host}:${serveResult.port}`);
}