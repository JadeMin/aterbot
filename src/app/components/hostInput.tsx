import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
	FormControl, FormLabel, FormHelperText, FormErrorMessage,
	Input, Button
} from '@chakra-ui/react';

import { errorState, hostState } from "@/states/input.ts";



export default function HostInput() {
	const error = useRecoilValue(errorState);
	const [host, setHost] = useRecoilState(hostState);

	
	return (
		<FormControl isInvalid={error} isRequired>
			<FormLabel>Host (URL or IP)</FormLabel>
			<Input
				value={host}
				onChange={event => setHost(event.target.value)}
			/>
			{/*!isError ||
				<FormErrorMessage>Please enter a valid host</FormErrorMessage>
			*/}
		</FormControl>
	);
};