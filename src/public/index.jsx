import {
	createElement, Fragment,
	Suspense, lazy
} from 'react';
import { createRoot } from 'react-dom/client';
import {
	BrowserRouter,
	Routes, Route
} from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import Menus from "./routes/components/Menus";
const Main = lazy(()=> import("./routes/top"));
const Login = lazy(()=> import("./routes/login"));
const Logout = lazy(()=> import("./routes/logout"));
const ConfigGenerator = lazy(()=> import("./routes/config_gen"));
const NotFound = lazy(()=> import("./routes/404"));


const root = document.querySelector("#app");
createRoot(root).render(
	<BrowserRouter basename='/dashboard/'>
		<Menus/>
		<Suspense fallback={
			<center>
				<Spin indicator={
					<LoadingOutlined style={{fontSize: 24}} spin/>
				}/>
			</center>
		}>
			<Routes>
				<Route
					path='/'
					element={<Main/>}
				/>

				<Route
					path='/cfg'
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
		</Suspense>
	</BrowserRouter>
);