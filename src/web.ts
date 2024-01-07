import HTTP from 'node:http';

const PORT = process.PORT || 5500;
const server = HTTP.createServer((request, response) => {
	response.writeHead(200, {
		"Access-Control-Allow-Origin": "https://ajiedev-net.rf.gd",
		"Access-Control-Allow-Methods": "GET, PING, OPTIONS",
		"Content-Type": "text/html"
	} as const);
	response.end("<h3>Web Running And Connected to Code Server!</h3>");
});



export default (): void => {
	server.listen(PORT, () => console.log("Web service is ready!"));
};