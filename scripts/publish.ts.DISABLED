import { publish } from 'gh-pages';

const options = ["./dist", {
	branch: 'gh-pages',
	message: "publish: auto published"
}] as const;



const result = await publish(...options);
if(result) throw result;
console.log("Successfully published on the GitHub Pages!");