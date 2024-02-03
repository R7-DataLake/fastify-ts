import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	fastify.register(require('@fastify/jwt'), {
		secret: process.env.SECRET_KEY,
		sign: {
			iss: 'test.demo.dev',
			expiresIn: '15m',
		},
		messages: {
			badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
			noAuthorizationInHeaderMessage: 'Autorization header is missing!',
			authorizationTokenExpiredMessage: 'Authorization token expired',
			authorizationTokenInvalid: (err: any) => {
				return `Authorization token is invalid: ${err.message}`;
			},
		},
	});
});
