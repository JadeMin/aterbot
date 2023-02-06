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
	return (
		<>
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