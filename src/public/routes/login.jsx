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

export default () => {
	const [notiApi, contextHolder] = notification.useNotification();
	const navigate = useNavigate();
	const SHA256 = async (data) => {
		const buffers = new TextEncoder().encode(data);
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffers);
		return Array.from(new Uint8Array(hashBuffer)).map(b=> b.toString(16).padStart(2, '0')).join('');
	};
	const verify = async (password) => {
		const response = await fetch('/api/verify', {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				password: await SHA256(password)
			})
		});
		
		const data = await response.json();
		if(data.status === 'success') {
			alert("Seccessfully Logged in.");
			navigate(-1, {replace: true});
		} else {
			sessionStorage.removeItem('pw');
			alert(data.message);

			location.reload();
		}
	};
	useEffect(async () => {
		if(sessionStorage.getItem('pw') !== null) {
			await verify(sessionStorage.getItem('pw'));
		} else {
			const input = prompt("Input your password:");
			if(input.length === 0) return navigate(-1);
			await verify(input);
		}
	}, []);


	return (
		<>
			{contextHolder}
			<Result
				status="404"
				title="404 - Not Found"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Button type="primary" onClick={()=> navigate(-1)}>Go back</Button>}
			/>
		</>
	);
};