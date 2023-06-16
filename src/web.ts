import HTTP from 'http';

const PORT = process.PORT || 5500;
const server = HTTP.createServer((request, response) => {
	response.writeHead(200, {
		"Access-Control-Allow-Origin": "no-bitches.lol",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Content-Type": "text/html"
	});
	response.end("<bold>Copy me, the url above!</bold>");
});



server.listen(PORT, ()=> console.log("Server for UptimeRobot is ready!"));