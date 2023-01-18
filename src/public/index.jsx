import React from 'react';
import { createRoot } from 'react-dom/client';
import {
	BrowserRouter,
	Routes, Route
} from 'react-router-dom';

import Main from "./routes/top";
import Logs from "./routes/logs";
import Login from "./routes/login";
import Logout from "./routes/logout";
import NotFound from "./routes/404";

import Menus from "./routes/components/Menus";

const root = document.querySelector("#app");


createRoot(root).render(
	<BrowserRouter basename='/dashboard/'>
		<Menus/>
		<Routes>
			<Route
				path='/'
				element={<Main/>}
			/>

			<Route
				path='/logs'
				element={<Logs/>}
			/>

			<Route
				path='/login'
				element={<Login/>}
			/>

			<Route
				path='/logout'
				element={<Logout/>}
			/>

			<Route
				path='*'
				element={<NotFound/>}
			/>
		</Routes>
	</BrowserRouter>
);