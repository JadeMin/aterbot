import ESBuild from 'esbuild';
//import Plugin_HTML from '@chialab/esbuild-plugin-html';

export default async () => {
	await ESBuild.build({
		platform: 'browser',
		format: 'esm',
		target: 'esnext',

		bundle: true,
		treeShaking: true,
		splitting: true,
		minify: true,
		sourcemap: true,

		jsxFactory: 'createElement',
		jsxFragment: 'Fragment',
		

		entryPoints: [
			"src/public/index.jsx",
			"src/public/index.css"
		],
		outdir: "public/",
	});
	console.debug("Build Success!");
};