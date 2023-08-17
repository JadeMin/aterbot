import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
	FormControl, FormLabel, FormHelperText, FormErrorMessage,
	Input, Button
} from '@chakra-ui/react';

import { errorState, usernameState } from "@/states/input.ts";



export default function UsernameInput() {
	const error = useRecoilValue(errorState);
	const [username, setUsername] = useRecoilState(usernameState);

	
	return (
		<FormControl isInvalid={error} marginTop={5} isRequired>
			<FormLabel>Username</FormLabel>
			<Input
				value={username}
				onChange={event => setUsername(event .target.value)}
			/>
		</FormControl>
	);
};