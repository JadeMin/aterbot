const http = require('http'); 
const mineflayer = require('mineflayer');
const CONFIG = require("./config.json");

let connected = false;
const actions = ['forward', 'back', 'left', 'right', 'jump'];
const sleep = ms => new Promise(resovle => setTimeout(resovle, ms));
const getRandom = array => array[Math.floor(Math.random() * (array.length - 0)) + 0];
const cLog = (msg, ...args) => {
	if(CONFIG.logger[0]) console.log(msg, ...args);
};



async function reconnect() {
	console.log(`Trying to reconnect in ${CONFIG.retryTimes.text}...\n`);
	connected = false;


	await sleep(CONFIG.retryTimes.ms);
	createAFKBot();
}
function createAFKBot() {
	const bot = mineflayer.createBot({
		host: CONFIG.host,
		port: CONFIG.port,
		username: CONFIG.username
	});


	bot.on('spawn', () => {
		connected = true;
		
		async function doMoving() {
			if(connected) {
				const lastAction = getRandom(actions);

				bot.setControlState(lastAction, true); // starts the selected random action
				if(Math.random() < 0.5) { // 50% chance
					bot.setControlState('sprint', true);
				}
				cLog(`${lastAction}${bot.getControlState('sprint')? " with sprint":''}`);

				await sleep(getRandom(CONFIG.actionDelays));
				bot.setControlState(lastAction, false); // starts the selected random action
				bot.setControlState('sprint', false);
			}


			await sleep(getRandom(CONFIG.actionDelays));
			doMoving();
		}
		async function changeViewPos() {
			if(connected) {
				const yaw = (Math.random() * Math.PI) - (0.5 * Math.PI);
				const pitch = (Math.random() * Math.PI) - (0.5 * Math.PI);

				bot.look(yaw, pitch, false);
			}

			
			await sleep(getRandom(CONFIG.actionDelays));
			changeViewPos();
		}


		changeViewPos();
		doMoving();
	});
	bot.on('error', error => {
		console.error(`AFKBot got an error: ${error}`);
		
		reconnect();
	});
	bot.on('kicked', async rawResponse => {
		const response = JSON.parse(rawResponse);
		if(!(response instanceof Error)) {
			console.error(`\n\nAFKbot is disconnected by reason: ${response?.with?.map(v=> v.text).join('\n')}`);
		}

		reconnect();
	});


	bot.on('login', () => {
		console.log(`AFKBot logged in ${CONFIG.username}\n\n`);
	});
}
createAFKBot();




const server = http.createServer((_request, response) => { 
    response.writeHead(200, {"Content-Type": 'text/html'});
    response.end('Pong!');
});
server.listen(process.env.PORT || 3000, () => { 
    console.log('Web for AntiAFK is running...');
});