import React, {
	useState, useEffect
} from 'react';
import {
	useNavigate
} from 'react-router-dom';
import {
	Result,
	Layout, Space, Grid, Row,
	Menu,
	Button, Input,

	message, notification
} from 'antd';
import { API, PWM } from "./.modules/api";

export default () => {
	const navigate = useNavigate();
	useEffect(() => {
		PWM.remove();
		navigate(-1);
	}, []);


	return (
		<>
			<Result
				status="404"
				title="Placeholder"
				subTitle="Placeholder"
				extra={<Button type="primary" onClick={()=> navigate(-1)}>Go back</Button>}
			/>
		</>
	);
};