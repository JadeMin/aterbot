import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import Home from "./routes/home.tsx";

const root = document.getElementById("app");

const App = () => {
	return (
		<ChakraProvider>
			<Home/>
		</ChakraProvider>
	);
};



if(root !== null) {
	createRoot(root).render(App());
} else {
	alert("A fatal error has occurred while rendering the client page.");
	alert("Please contact the developer.");
	history.back();
}