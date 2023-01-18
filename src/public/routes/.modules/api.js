const REQ = async (method, path, verify, options) => {
	if(!verify) throw new Error("Authorization is not set");

	return await (await fetch(`/api${path}`, {
		method: method,
		headers: {
			'Authorization': verify
		},
		...options
	})).json();
};
const GET = async (path, verify, options) => {
	return await REQ('GET', path, verify, options);
};
const POST = async (path, verify, options) => {
	return await REQ('POST', path, verify, options);
};


export const API = {
	verify: async (verify) => {
		return (await POST('/verify', verify)).correct;
	},
	connect: async (verify) => {
		return await POST('/connect', verify);
	},
	disconnect: async (verify) => {
		return await POST('/disconnect', verify);
	}
};
export const PWM = {
	get: ()=> localStorage.getItem('pw'),
	set: data=> localStorage.setItem('pw', data),
	remove: ()=> localStorage.removeItem('pw'),
	saved: ()=> localStorage.getItem('pw') !== null,
};