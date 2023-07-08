import { serve } from 'https://deno.land/std@0.193.0/http/server.ts';

const PORT = +!Deno.env.get('PORT') || 5500;
const handler = () => {
	return new Response("<h1>Copy me, the url above!</h1>", {
		headers: {
			"Access-Control-Allow-Origin": "no-bitches.lol",
			"Access-Control-Allow-Methods": "GET, PING, OPTIONS",
			"Content-Type": "text/html"
		}
	});
};



export default (): void => {
	serve(handler, {port: PORT})
		.then(() => console.log("Server for UptimeRobot is ready!"));
};