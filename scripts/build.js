import ESBuild from 'esbuild';
//import Plugin_HTML from '@chialab/esbuild-plugin-html';

export default async () => {
	return await ESBuild.context({
		platform: 'browser',
		format: 'esm',
		target: 'esnext',

		bundle: true,
		treeShaking: true,
		minify: true,
		sourcemap: true,

		entryPoints: [
			"src/public/index.jsx",
			"src/public/index.css"
		],
		outdir: "public/",
	});
};