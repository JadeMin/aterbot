const validateRE = {
	host: /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z0-9]{2,}$/i,
	port: /^[0-9]{1,5}$/,
	username: /^[a-z0-9_]{3,16}$/i,
} as const;



export const generateCode = (host: string, port: string, username: string): string => {
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

export const validate = (host: string, port: string, username: string): boolean => {
	return validateRE.host.test(host) &&
		validateRE.port.test(port) &&
		validateRE.username.test(username);
};