/*WSS.on('connection', (ws) => {
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
});*/

export default () => null;