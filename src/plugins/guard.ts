import fp from 'fastify-plugin';

export default fp(async (fastify) => {
	fastify.register(require('fastify-guard'), {
		errorHandler: (_result: any, _request: any, reply: any) => {
			return reply.status(405).send({
				ok: false,
				code: 405,
				error: 'You are not allowed to call this route',
			});
		},
	});
});
