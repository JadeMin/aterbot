import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
	useToast,

	Button,
} from '@chakra-ui/react';

import { errorState, hostState, portState, usernameState } from "@/states/input.ts";

import { generateCode, validate } from "./generate.ts";



export default function GenerateButton() {
	const toast = useToast();

	const setError = useSetRecoilState(errorState);
	const host = useRecoilValue(hostState);
	const port = useRecoilValue(portState);
	const username = useRecoilValue(usernameState);

	const onClick = async (): Promise<void> => {
		if(validate(host, port, username)) {
			setError(false);
			
			await navigator.clipboard.writeText(generateCode(host, port, username));
			toast({
				title: "Code generated!",
				description: "The generated code has been copied to your clipboard.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		} else {
			setError(true);
		}
		return;
	};


	return (
		<Button
			width="full"
			marginTop={10}
			type="submit"
			onClick={onClick}
		>
			Generate!
		</Button>
	);
};