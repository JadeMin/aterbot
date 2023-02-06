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
		(async () => {
			const _pw = prompt("Input your password:");

			if(_pw) {
				if(await API.verify(_pw)) {
					PWM.set(_pw);
					alert("You've been logged in.");
				} else {
					alert("The password is incorrect.\nPlease try again.");
					return location.reload();
				}
			}
			return navigate(-1);
		})();
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