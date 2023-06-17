import type { UseDisclosureReturn } from '@chakra-ui/react';

import React from 'react';
import {
	Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
	Button,
} from '@chakra-ui/react';



export const CodeModal = (
	{disclosure, code, header}:
	{
		disclosure: UseDisclosureReturn,
		code: string,
		header?: React.ReactNode | string,
	},
): React.ReactNode => {
	return (
		<Modal
			isOpen={disclosure.isOpen}
			onClose={disclosure.onClose}
			motionPreset="none"
		>
			<ModalOverlay/>
			<ModalContent>
				<ModalHeader>{header || "Generated!"}</ModalHeader>

				<ModalCloseButton/>

				<ModalBody>
					<pre>
						<code>{code}</code>
					</pre>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={()=> navigator.clipboard.writeText(code)}
					>
						Copy!
					</Button>
					<Button
						colorScheme="gray"
						mr={3}
						onClick={disclosure.onClose}
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};