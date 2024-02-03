import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	fastify.register(require('@fastify/rate-limit'), {
		global: true,
		max: 100,
		timeWindow: '1 minute',
		keyGenerator: (request: any) => {
			return request.headers['x-real-ip'];
		},
		errorResponseBuilder: (request: any, context: any) => {
			return {
				statusCode: 429,
				message: 'Too many requests. Please try again later.',
			};
		},
	});
});
