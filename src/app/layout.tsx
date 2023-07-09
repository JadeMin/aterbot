'use client';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';



export const metadata = {
	title: "Config Generator",
	description: "Generate a config file for AterBot",
} as const;

export default function RootLayout(props: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<body>
				<CacheProvider>
					<ChakraProvider>
						{props.children}
					</ChakraProvider>
				</CacheProvider>
			</body>
		</html>
	);
};