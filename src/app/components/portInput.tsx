import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
	FormControl, FormLabel, FormHelperText, FormErrorMessage,
	Input, Button
} from '@chakra-ui/react';

import { errorState, portState } from "@/states/input.ts";



export default function PortInput() {
	const error = useRecoilValue(errorState);
	const [port, setPort] = useRecoilState(portState);

	
	return (
		<FormControl isInvalid={error} marginTop={5} isRequired>
			<FormLabel>Port</FormLabel>
			<Input
				value={port}
				onChange={event => setPort(event.target.value)}
			/>
		</FormControl>
	);
};