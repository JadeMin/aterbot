'use client';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';



export const metadata = {
	title: "Config Generator",
	description: "Generate a config file for AternBot",
} as const;

export default function RootLayout(props: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<CacheProvider>
				<ChakraProvider>
					{props.children}
				</ChakraProvider>
			</CacheProvider>
		</html>
	);
};