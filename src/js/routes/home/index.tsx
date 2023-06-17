import React, {
	useState,
} from 'react';
import {
	useToast,

	Flex, Box,
	FormControl, FormLabel, FormHelperText, FormErrorMessage,
	Input, Button
} from '@chakra-ui/react';



export default (): React.ReactNode => {
	const toast = useToast();
	const [isError, setError] = useState(false);
	const [host, setHost] = useState('');
	const [port, setPort] = useState('');
	const [username, setUsername] = useState('');

	const generateCode = (): string => {
		const code = {
			client: {
				host: "Please enter your server ip or url",
				port: "Please enter your server port",
				username: "Please enter the bot's username you want"
			},
			
			"! DO NOT EDIT BELOW !": "ONLY IF YOU KNOW WHAT YOU ARE DOING",
			logLevel: ["error", "log", "debug"],
			action: {
				commands: ["forward", "back", "left", "right", "jump"],
				holdDuration: 5000,
				retryDelay: 15000
			}
		};
		code.client.host = host;
		code.client.port = port;
		code.client.username = username;

		return JSON.stringify(code, null, '\t');
	};
	const onGenerate = async (): Promise<void> => {
		const isAllFilled = host.length && port.length && username.length;
		if(!isAllFilled) {
			setError(true);
		} else {
			setError(false);

			await navigator.clipboard.writeText(generateCode());
			toast({
				title: "Code generated!",
				description: "The code has been copied to your clipboard.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		}
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
				<form onSubmit={e=> e.preventDefault()}>
					<FormControl isInvalid={isError} isRequired>
						<FormLabel>Host (URL or IP)</FormLabel>
						<Input
							value={host}
							onChange={e=> setHost(e.target.value)}
						/>
						{/*!isError ||
							<FormErrorMessage>Please enter a valid host</FormErrorMessage>
						*/}
					</FormControl>

					<FormControl isInvalid={isError} marginTop={5} isRequired>
						<FormLabel>Port</FormLabel>
						<Input
							value={port}
							onChange={e=> setPort(e.target.value)}
						/>
					</FormControl>

					<FormControl  isInvalid={isError} marginTop={5} isRequired>
						<FormLabel>Username</FormLabel>
						<Input
							value={username}
							onChange={e=> setUsername(e.target.value)}
						/>
					</FormControl>

					<Button
						width="full"
						marginTop={10}
						type="submit"
						onClick={onGenerate}
					>
						Generate!
					</Button>
				</form>
			</Box>
		</Flex>
	);
};