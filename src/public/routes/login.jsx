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
	const navigate = useNavigate();
	useEffect(async () => {
		const SHA256 = async (data) => {
			const buffers = new TextEncoder().encode(data);
			const hashBuffer = await crypto.subtle.digest('SHA-256', buffers);
			return Array.from(new Uint8Array(hashBuffer)).map(b=> b.toString(16).padStart(2, '0')).join('');
		};
		const PWM = {
			get: ()=> localStorage.getItem('pw'),
			set: data=> localStorage.setItem('pw', data),
			remove: ()=> localStorage.removeItem('pw'),
			
			verify: async (password) => {
				const response = await fetch('/api/verify', {
					method: 'POST',
					headers: {
						'Authorization': password
					}
				});
				const data = await response.json();
				return data.correct;
			}
		};

		if(PWM.get() !== null) {
			if(await PWM.verify(PWM.get())) {
				if(confirm("You've been already logged in.\nDo you mean log out?")) {
					PWM.remove();
					navigate(-1);
				} else {
					navigate(-1);
				}
			} else {
				PWM.remove();
				alert("The saved password is incorrect.\nPlease input your password again.");
				location.reload();
			}
		} else {
			const _pw = prompt("Input your password:");
			if(_pw !== null) {
				const hashedPw = await SHA256(_pw);

				if(await PWM.verify(hashedPw)) {
					PWM.set(hashedPw);
					alert("You've been logged in.");
					navigate(-1);
				} else {
					alert("The password is incorrect.\nPlease try again.");
					location.reload();
				}
			} else {
				return navigate(-1);
			}
		}
	}, []);


	return (
		<>
			<Result
				status="404"
				title="404 - Not Found"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Button type="primary" onClick={()=> navigate(-1)}>Go back</Button>}
			/>
		</>
	);
};