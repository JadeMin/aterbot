import React from 'react';
import { Menu } from 'antd';

export default () => (
	<Menu
		mode="horizontal"
		items={[
			{
				label: (
					<a href="/">
						Dashboard
					</a>
				)
			},
			{
				label: (
					<a href="logs">
						Logs
					</a>
				)
			},
			{
				label: (
					<a href="login">
						Login / Logout
					</a>
				)
			}
		]}
	/>
);