import { copyFile } from 'node:fs/promises';
import { context } from 'esbuild';



const buildResult = await context({
	entryPoints: ["./src/js/index.tsx"],
	outdir: "./dist/",

	bundle: true,
	treeShaking: true,
	minify: true,
	sourcemap: true
});
await buildResult.rebuild();
await buildResult.watch();
await copyFile("./src/index.html", "./dist/index.html");
console.log("Build complete!");


const serveResult = await buildResult.serve({
	host: "localhost",
	port: 5500,
	servedir: "./dist/",
});
console.log(`Serving at http://${serveResult.host}:${serveResult.port}`);