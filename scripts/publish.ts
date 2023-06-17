import { publish } from 'gh-pages';

const options = ["./dist", {
	branch: 'gh-pages',
	message: "deploy: auto published"
}] as const;



const result = await publish(...options);
if(result) throw result;
console.log("성공적으로 GitHub Pages에 배포되었습니다!");