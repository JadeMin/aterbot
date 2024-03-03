import Mineflayer from 'mineflayer';
import { sleep, getRandom } from "./utils.ts";
import CONFIG from "../config.json" assert {type: 'json'};

let loop: NodeJS.Timeout;
let bot: Mineflayer.Bot;

const disconnect = (): void => {
	clearInterval(loop);
	bot?.quit?.();
	bot?.end?.();
};
const reconnect = async (): Promise<void> => {
	console.log(`Trying to reconnect in ${CONFIG.action.retryDelay / 1000} seconds...\n`);

	disconnect();
	await sleep(CONFIG.action.retryDelay);
	createBot();
	return;
};

const createBot = (): void => {
	bot = Mineflayer.createBot({
		host: CONFIG.client.host,
		port: +CONFIG.client.port,
		username: CONFIG.client.username
	} as const);


	bot.once('error', error => {
		console.error(`AFKBot got an error: ${error}`);
	});
	bot.once('kicked', rawResponse => {
		console.error(`\n\nAFKbot is disconnected: ${rawResponse}`);
	});
	bot.once('end', () => void reconnect());

	bot.once('spawn', () => {
		const changePos = async (): Promise<void> => {
			const lastAction = getRandom(CONFIG.action.commands) as Mineflayer.ControlState;
			const halfChance: boolean = Math.random() < 0.5? true : false; // 50% chance to sprint

			console.debug(`${lastAction}${halfChance? " with sprinting" : ''}`);

			bot.setControlState('sprint', halfChance);
			bot.setControlState(lastAction, true); // starts the selected random action

			await sleep(CONFIG.action.holdDuration);
			bot.clearControlStates();
			return;
		};
		const changeView = async (): Promise<void> => {
			const yaw = (Math.random() * Math.PI) - (0.5 * Math.PI),
				pitch = (Math.random() * Math.PI) - (0.5 * Math.PI);
			
			await bot.look(yaw, pitch, false);
			return;
		};
		
		loop = setInterval(() => {
			changeView();
			changePos();
		}, CONFIG.action.holdDuration);
	});
	bot.once('login', () => {
		console.log(`AFKBot logged in ${bot.username}\n\n`);
	});
};



export default (): void => {
	createBot();
};