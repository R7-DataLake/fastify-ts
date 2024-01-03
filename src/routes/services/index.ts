import { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance, options: any, done: any) => {
	// verify jwt token
	fastify.addHook('onRequest', (request) => request.jwtVerify());

	fastify.register(require('./users'), { prefix: '/users' });

	done();
};
