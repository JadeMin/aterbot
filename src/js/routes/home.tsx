import React, {
	useState,
} from 'react';
import {
	FormControl, FormLabel, FormHelperText, FormErrorMessage,
	Input,
} from '@chakra-ui/react'


export default () => {
	const [input, setInput] = useState('');

	const isError = input.length === 0;



	return (
		<>
			<FormControl isInvalid={isError}>
				<FormLabel>Host (URL or IP)</FormLabel>
				<Input value={input} onChange={e=> setInput(e.target.value)}/>
				{!isError?
					<FormHelperText>
						Enter the host of the server you want to connect to.
					</FormHelperText>
					:
					<FormErrorMessage>
						Please enter a host.
					</FormErrorMessage>
				}
			</FormControl>
		</>
	);
};