import React, {
	useState,
} from 'react';
import {
	useDisclosure,

	Flex, Box,
	FormControl, FormLabel, FormHelperText, FormErrorMessage,
	Input, Button
} from '@chakra-ui/react';

import { CodeModal } from "./components/codeModal.tsx";



export default (): React.ReactNode => {
	const disclosure = useDisclosure();
	const [code, setCode] = useState('');
	const [host, setHost] = useState('');
	const [port, setPort] = useState('');
	const [username, setUsername] = useState('');

	const generateCode = () => {
		const code = {
			"host": '',
			"port": 0,
			"i"
		}
	};
	const onGenerate = () => {
		disclosure.onOpen();
	};


	return (
		<>
			<Flex
				width="full"
				align="center"
				justifyContent="center"
			>
				<Box
					minW={{ md: "400px" }}
					marginY={4}
				>
					<FormControl isRequired>
						<FormLabel>Host (URL or IP)</FormLabel>
						<Input
							value={host}
							onChange={e=> setHost(e.target.value)}
						/>
						<FormHelperText>
							URL or IP address of your server
						</FormHelperText>
					</FormControl>

					<FormControl marginTop={5} isRequired>
						<FormLabel>Port</FormLabel>
						<Input
							value={port}
							onChange={e=> setPort(e.target.value)}
						/>
						<FormHelperText>
							Port number of your server
						</FormHelperText>
					</FormControl>

					<FormControl marginTop={5} isRequired>
						<FormLabel>Username</FormLabel>
						<Input
							value={username}
							onChange={e=> setUsername(e.target.value)}
						/>
						<FormHelperText>
							Username of your bot
						</FormHelperText>
					</FormControl>

					<Button
						width="full"
						marginTop={10}
						onClick={onGenerate}
					>
						Generate!
					</Button>
				</Box>
			</Flex>

			<CodeModal
				code={code}
				disclosure={disclosure}
			/>
		</>
	);
};