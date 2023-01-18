import React, {
	useState, useEffect
} from 'react';
import {
	Layout, Space, Grid, Row,
	Menu,
	Button, Input,

	message, notification
} from 'antd';
import { API, PWM } from "./.modules/api";

export default () => {
	const [logs, setLogs] = useState([]);
	const [msgApi, msgHolder] = message.useMessage();
	useEffect(() => {
		if(!PWM.saved()) return msgApi.warning("Please log in first.");
		WebSocket.prototype.defaultSend = WebSocket.prototype.send;
		WebSocket.prototype.send = function(data) {
			this.defaultSend(JSON.stringify(data));
		};
		
		const isSecure = location.protocol === 'https:';
		const ws = new WebSocket(`${isSecure? 'wss':'ws'}://${location.hostname}`);
		ws.onopen = () => {
			console.debug('WebSocket connected');
			ws.send({
				type: 'subscribe',
				target: 'logs'
			});
		};
		ws.onmessage = (message) => {
			const msg = JSON.parse(message.data);
			if(msg.type === 'subscription' && msg.target === 'logs') {
				setLogs(msg.data);
			}
		};
	}, []);


	return (
		<>
			{msgHolder}
			<Row justify="center">
				<Space wrap direction="vertical">
					{/*<Button
						type="primary"
					>
						Clear logs
					</Button>*/}
					<Input.TextArea
						autoSize
						disabled
						value={logs}
					/>
				</Space>
			</Row>
		</>
	)
};