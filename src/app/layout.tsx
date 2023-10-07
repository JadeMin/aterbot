import Providers from "./providers.tsx";



export const metadata = {
	title: "Config Generator",
	description: "Generate a config file for AterBot",
};

export default function RootLayout(props: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<body>
				<Providers>{props.children}</Providers>
			</body>
		</html>
	);
};