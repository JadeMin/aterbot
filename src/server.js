import { fileURLToPath } from 'url';
import Express from 'express';
//import { WebSocketServer } from 'ws';

import CONFIG from "../config.json" assert {type: 'json'};
import Build from "../scripts/build.js";
import AFKBot from "./bot.js";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = {
	web: process.env.PORT || 5500,
	socket: (process.env.PORT || 5500) + 1
};

const Server = Express();
/*const WSS = new WebSocketServer({
	port: port.socket
});*/
const Bot = new AFKBot(CONFIG);



(await Build())//.watch();
console.debug("Build Success!");

(function WebServer() {
	const password = process.env['PASSWORD'] || process.env['password'];
	const verify = request => {
		const reqAuth = request.headers['authorization'];
		console.debug(`PASSWORD in your REPL Secrets: ${password}`);
		console.debug(`PASSWORD in someone's request: ${reqAuth}`);
		return reqAuth === password;
	};
	Server.use(Express.static(`public`));
	Server.use(Express.json());

	Server.get('/dashboard/*', (request, response) => {
		response.sendFile(`${__dirname}/public/index.html`);
	});
	Server.post('/api/verify', async (request, response) => {
		if(!password) return response.send({
			status: 'error',
			message: "You didn't set the password in the Repl Secrets.\nPlease set it correctly and try again."
		});
		return response.send({correct: verify(request)});
	});
	Server.post('/api/connect', async (request, response) => {
		if(!verify(request)) return response.send({
			status: 'error',
			message: "You've logged in with the wrong password.\nPlease login again."
		});
		if(Bot.connected) return response.send({
			status: 'error',
			message: "The bot has been already connected!"
		});

		try {
			await Bot.connect();
			return response.send({
				status: 'success',
				message: "The bot has been connected!"
			});
		} catch(error) {
			return response.send({
				status: 'error',
				message: "ERROR",
				description: error.text ?? error.message
			});
		}
	});
	Server.post('/api/disconnect', async (request, response) => {
		if(!verify(request)) return response.send({
			status: 'error',
			message: "You're logged in with the wrong password.\nPlease login again."
		});
		if(!Bot.connected) return response.send({
			status: 'error',
			message: "The bot is currently not connected!"
		});

		try {
			await Bot.disconnect();
			return response.send({
				status: 'success',
				message: "The bot has been disconnected!"
			});
		} catch(error) {
			return response.send({
				status: 'error',
				message: "ERROR",
				description: error.text ?? error.message
			});
		}
	});
	Server.all('*', async (request, response) => {
		return response.status(404).redirect('/dashboard/');
	});
	Server.listen(port.web, ()=> console.log("Web Dashboard is now running!"));
}());

/*(function SocketServer() {
	WSS.on('connection', (ws) => {
		const send = data=> ws.send(JSON.stringify(data));

		ws.on('message', (message) => {
			const msg = JSON.parse(message);
			if(msg.type === 'subscribe' && msg.target === 'logs') {
				Bot.subscribeLogs(logs=> {
					send({
						type: 'subscription',
						target: 'logs',
						data: logs
					});
				});
			}
		});
	});
}());*/