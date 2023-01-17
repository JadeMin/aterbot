import React, {
	useState, useEffect
} from 'react';
import {
	useNavigate
} from 'react-router-dom';
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

export default () => {
	const [notiApi, contextHolder] = notification.useNotification();
	const [joining, setJoining] = useState(false);
	const [exiting, setExiting] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		if(localStorage.getItem('pw') === null) {
			alert("You're not logged in.\nPlease log in.");
			navigate("/login");
		}
	});

	const loginBot = async () => {
		setJoining(true);
		const response = await fetch('/api/connect', {
			method: 'POST',
			headers: {
				'Authorization': localStorage.getItem('pw')
			}
		});
		const data = await response.json();
		notiApi[data.status]({
			message: data.message,
			description: data.description
		});
		setJoining(false);
	};
	const logoutBot = async () => {
		setExiting(true);
		const response = await fetch('/api/disconnect', {
			method: 'POST',
			headers: {
				'Authorization': localStorage.getItem('pw')
			}
		});
		const data = await response.json();
		notiApi[data.status]({
			message: data.message,
			description: data.description
		});
		setExiting(false);
	};


	return (
		<>
			{contextHolder}
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