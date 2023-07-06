const isDev = process.env.NODE_ENV !== "production";



/** @type {import('next').NextConfig} */
export default {
	output: "export",
	distDir: isDev? "./docs" : '',
	basePath:  isDev? "/aternos-afkbot" : ''
};