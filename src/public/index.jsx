import React from 'react';
import { createRoot } from 'react-dom/client';
import {
	BrowserRouter,
	Routes, Route
} from 'react-router-dom';

import Menus from "./routes/components/Menus";

import Main from "./routes/top";
import Login from "./routes/login";
import Logout from "./routes/logout";
import ConfigGenerator from "./routes/config_gen";
import NotFound from "./routes/404";


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
				path='/cfgen'
				element={<ConfigGenerator/>}
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