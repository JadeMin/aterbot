import React from 'react';
import { Menu } from 'antd';
import { API, PWM } from "../.modules/api";

export default () => {
	const LoginOrOut = PWM.saved()? "Logout":"Login";
	
	return (
		<Menu
			mode="horizontal"
			items={[
				{
					label: (
						<a href="/dashboard">
							Dashboard
						</a>
					)
				},
				{
					label: (
						<a href={LoginOrOut.toLowerCase()}>
							{LoginOrOut}
						</a>
					)
				}
			]}
		/>
	);
};