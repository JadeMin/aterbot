'use client';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';



export default function Providers(props: {children: React.ReactNode}) {
	return (
		<ChakraProvider>
			<RecoilRoot>
				{props.children}
			</RecoilRoot>
		</ChakraProvider>
	);
};