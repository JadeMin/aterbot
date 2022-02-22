const http = require('http'); 
const mineflayer = require('mineflayer');
const CONFIG = require("./config.json");

let connected = false;
//let reconnectTries = 0;
const times = [500, 1000, 1500, 2000, 2500, 3000];
const actions = ['forward', 'back', 'left', 'right', 'jump'];
function sleep(ms){
	return new Promise(resovle=> setTimeout(resovle, ms));
}
function getRandom(array) {
	return array[Math.floor(Math.random() * (array.length - 0)) + 0];
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
			const lastAction = getRandom(actions);

			bot.setControlState(lastAction, true); // starts the selected random action
			if(Math.random() < 0.5) { // 50% chance
				bot.setControlState('sprint', true);
			}
			if(CONFIG.logger[0]) console.log(`${lastAction}${bot.getControlState('sprint')? " with sprint":''}`);

			await sleep(getRandom(times));
			bot.setControlState(lastAction, false); // starts the selected random action
			bot.setControlState('sprint', false);



			await sleep(getRandom(times));
			if(connected) doMoving();
		}
		async function changeViewPos() {
			const yaw = (Math.random() * Math.PI) - (0.5 * Math.PI);
			const pitch = (Math.random() * Math.PI) - (0.5 * Math.PI);

			bot.look(yaw, pitch, false);



			await sleep(getRandom(times));
			if(connected) changeViewPos();
		}


		changeViewPos();
		doMoving();
		/*bot.on('time', () => {
			
				const randomAdd = getRandom(0, BOT.movement.randomMax) * 20;
				const moveInterval = BOT.movement.interval*20 + randomAdd;
		
				if(bot.time.age - lastTime > moveInterval) {
					if(isMoving == true) { // if the bot is moving
						bot.setControlState(lastAction, false); // stop the selected random action
						isMoving = false; // set the bot is stopped moving
						
						lastTime = bot.time.age;
					} else {  // if the bot isn't moving
						const yaw = Math.random() * Math.PI - (0.5 * Math.PI); // yaw
						const pitch = Math.random() * Math.PI - (0.5 * Math.PI); // pitch
						bot.look(yaw, pitch, false); // change the view pos of the bot
		
						lastAction = actions[Math.floor(Math.random() * actions.length)]; // select one random action
						bot.setControlState(lastAction, true); // do selected random action
						isMoving = true; // set the bot is started moving
						
						lastTime = bot.time.age; // update bot time age
						bot.activateItem(); // ??
					}
				}
			}
		});*/
	});
	bot.on('error', async error => {
		console.error(`AFKBot got an error: ${error}`);
		console.log("Trying to reconnect in 10s...");
		connected = false;


		await sleep(10000);
		createAFKBot();
	});
	bot.on('kicked', async (rawResponse) => {
		const response = JSON.parse(rawResponse);
		if(!(response instanceof Error)) {
			console.error(`\n\nAFKbot is disconnected by reason: ${response?.with?.map(v=> v.text).join('\n')}`);
		}
		console.log("Trying to reconnect in 10s...");
		connected = false;


		await sleep(10000);
		createAFKBot();
		/*if(reconnectTries >= 10) {
			console.log("Too many reconnection tries! Now tries to reconnect every 30s...");
			await sleep(30000);
		} else {
			console.log("Trying to reconnect in 10s...");
			await sleep(10000);
			reconnectTries++;
		}*/
	});


	bot.on('login', () => {
		console.log(`AFKBot logged in ${CONFIG.username}\n\n`);
	});
}
createAFKBot();




const server = http.createServer((_request, response) => { 
    response.writeHead(200, {"Content-Type": 'text/html'});
    response.end("Pong!");
});
server.listen(process.env.PORT || 3000, () => { 
    console.log("Web for AntiAFK is running...");
});