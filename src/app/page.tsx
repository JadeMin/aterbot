'use client';
import {
	Flex, Box,
} from '@chakra-ui/react';

import HostInput from "./components/hostInput.tsx";
import PortInput from "./components/portInput.tsx";
import UsernameInput from "./components/usernameInput.tsx";
import GenerateButton from "./components/generateButton.tsx";



export default function RootPage(): React.ReactNode {
	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		return event.preventDefault();
	};
	

	return (
		<Flex
			width="full"
			align="center"
			justifyContent="center"
		>
			<Box
				minW={{ md: "400px" }}
				marginY={4}
			>
				<form onSubmit={onSubmit}>
					<HostInput/>
					<PortInput/>
					<UsernameInput/>
					<GenerateButton/>
				</form>
			</Box>
		</Flex>
	);
};