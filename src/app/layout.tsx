import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';



export const metadata = {
	title: "Config Generator",
	description: "Generate a config file for AterBot",
};

export default function RootLayout(props: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<body>
				<ChakraProvider>
					<RecoilRoot>
						{props.children}
					</RecoilRoot>
				</ChakraProvider>
			</body>
		</html>
	);
};