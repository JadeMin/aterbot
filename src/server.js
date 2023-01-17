import { fileURLToPath } from 'url';
import Crypto from 'node:crypto';
import Express from 'express';
import { WebSocketServer } from 'ws';

import Build from "../scripts/build.js";
import AFKBot from "./bot.js";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = {
	web: process.env.PORT || 3000,
	socket: (process.env.PORT || 3000) + 1
};
const Server = Express();
const WSS = new WebSocketServer({port: port.socket});
const Bot = new AFKBot();



(await Build()).watch().then(() => {
	console.debug("Build Success!");

	(function DashboardServer() {
		const SHA256 = data=> Crypto.createHash('sha256').update(data).digest('hex');
		const verify = req=> SHA256('sival') === req.headers['authorization'];
		Server.use(Express.static(`public`));
		Server.use(Express.json());
		Server.get('/dashboard/*', (request, response) => {
			response.sendFile(`${__dirname}/public/index.html`);
		});
		Server.post('/api/verify', async (request, response) => {
			// verify the password using request body content
			if(verify(request)) {
				return response.send({status: 'wrong'});
			} else {
				return response.send({status: 'correct'});
			}
		});
		Server.post('/api/connect', async (request, response) => {
			if(Bot.connected) return response.send({
				status: 'error',
				message: "The bot has been already connected"
			});
			if(!verify(request)) return response.send({
				status: 'error',
				message: "You've logged in with the wrong password.\nPlease login again."
			});


			try {
				await Bot.connect();
				return response.send({
					status: 'success',
					message: "The bot has been connected"
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
			if(!Bot.connected) return response.send({
				status: 'error',
				message: "The bot is currently not connected"
			});
			if(!verify(request)) return response.send({
				status: 'error',
				message: "You're logged in with the wrong password.\nPlease login again."
			});


			try {
				await Bot.disconnect();
				return response.send({
					status: 'success',
					message: "The bot has been disconnected"
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

		Server.listen(port.web, () => {
			console.log('Web Dashboard is now running!');
		});
	}());


	(function SocketServer() {
		WSS.on('connection', (ws) => {
			const send = data=> ws.send(JSON.stringify(data));

			ws.on('message', (message) => {
				const msg = JSON.parse(message);
				if(msg.type === 'subscribe') {
					if(msg.target === 'logs') {
						const logs = Bot.subscribeLogs(logs=> {
							send({
								type: 'subscription',
								target: 'logs',
								data: logs
							});
						});

						send({
							type: 'subscription',
							target: 'logs',
							data: logs
						});
					}
				} else {
					console.error('Unknown message type:', msg.type ?? msg);
				}
			});
		});
	}());
});