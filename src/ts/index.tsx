import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import Home from "./routes/home/index.tsx";

const root = document.getElementById("app");



if(root !== null) {
	createRoot(root).render(
		<ChakraProvider>
			<Home/>
		</ChakraProvider>
	);
} else {
	alert("A fatal error has occurred while rendering the client page.");
	alert("Please contact the developer.");
	history.back();
}