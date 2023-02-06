import Mineflayer from 'mineflayer';
import CONFIG from "../config.json" assert {type: 'json'};
const sleep = ms=> new Promise(resovle => setTimeout(resovle, ms));
const random = array=> array[Math.floor(Math.random()*(array.length-0)) + 0];

export default class AFKBot {
	constructor(CONFIG) {
		/*{
			host: CONFIG.host,
			port: CONFIG.port,
			username: CONFIG.username
		}*/
		this.Bot = null;
		this.connected = false;
		this.firstError = true;
	};


	#createBot() {
		return new Promise(async (resolve, reject) => {
			const { client: $client, action: $action } = CONFIG;
			const Bot = Mineflayer.createBot($client);

			Bot.once('spawn', () => {
				const changePos = async () => {
					if(this.connected) {
						const lastAction = random($action.commands);
						const sprinting = Math.random() < 0.5? true:false; //50% chance to sprint

						console.debug(`${lastAction}${sprinting? " with sprinting" : ''}`);
						Bot.setControlState('sprint', sprinting);
						Bot.setControlState(lastAction, true); //starts the selected random action

						await sleep(random($action.holdDelays));
						Bot.setControlState(lastAction, false); //stops the selected random action
						await sleep(random($action.holdDelays));
						changePos();
					}
				}; changePos();
				const changeView = async () => {
					if(this.connected) {
						const yaw = (Math.random() * Math.PI) - (0.5 * Math.PI),
							pitch = (Math.random() * Math.PI) - (0.5 * Math.PI);
						
						Bot.look(yaw, pitch, false);

						await sleep(random($action.holdDelays));
						changeView();
					}
				}; changeView();

				return resolve(Bot);
			});
			Bot.once('error', error => {
				console.error(`AFKBot got an error: ${error}`);
				if(!this.firstError) this.reconnect();
				
				return reject(error);
			});
			Bot.once('kicked', async rawResponse => {
				console.error(`\n\nAFKbot is disconnected: ${rawResponse}`);
				if(!this.firstError) this.reconnect();

				return reject(JSON.parse(rawResponse));
			});
			Bot.once('end', ()=> this.connected=false);
			Bot.once('login', () => {
				console.log(`AFKBot logged in ${$client.username}\n\n`);
				this.connected = true;
				this.firstError = false;
			});
		});
	};

	async reconnect(now=false) {
		const { action: $action } = CONFIG;
		this.connected = false;
		
		if(!now) {
			console.log(`Trying to reconnect in ${$action.retryDelay / 1000} seconds...\n`);
			await sleep($action.retryDelay);
		}
		return this.connect();
	};
	async disconnect() {
		await this.Bot.quit();
		await this.Bot.end();
		this.connected = false;
	};
	async connect() {
		return this.Bot = await this.#createBot();
	};
	subscribeLogs(callback) {
		console.subscribe(callback);
	};
};