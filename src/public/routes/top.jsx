import React, {
	useState, useEffect
} from 'react';
import {
	PlusOutlined,
	PoweroffOutlined,
} from '@ant-design/icons';
import {
	Layout, Space, Grid, Row,
	Menu,
	Button,

	message, notification
} from 'antd';
import { API, PWM } from "./.modules/api";

export default () => {
	const [joining, setJoining] = useState(false);
	const [exiting, setExiting] = useState(false);
	const [msgApi, msgHolder] = message.useMessage();
	const [notiApi, notiHolder] = notification.useNotification();

	const loginBot = async () => {
		if(!PWM.saved()) return msgApi.warning("Please log in first.");

		setJoining(true);
		const response = await API.connect(localStorage.getItem('pw'));
		notiApi[response.status]({
			message: response.message,
			description: response.description
		});
		setJoining(false);
	};
	const logoutBot = async () => {
		if(!PWM.saved()) return msgApi.warning("Please log in first.");

		setExiting(true);
		const response = await API.disconnect(localStorage.getItem('pw'));
		notiApi[response.status]({
			message: response.message,
			description: response.description
		});
		setExiting(false);
	};


	return (
		<>
			{msgHolder}
			{notiHolder}
			<Row justify="center">
				<Space wrap>
					<Button
						type="primary"
						loading={joining}
						icon={<PlusOutlined/>}

						onClick={loginBot}
					>
						Join Bot
					</Button>
					<Button
						type="primary"
						danger
						icon={<PoweroffOutlined/>}
						loading={exiting}
						onClick={logoutBot}
					>
						Quit Bot
					</Button>
				</Space>
			</Row>
		</>
	)
};