import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Knex } from 'knex';
import _ from 'lodash';

import { LoginService } from '../models/login';

export default async (fastify: FastifyInstance, options: any, done: any) => {
	const db: Knex = fastify.db;
	const loginService = new LoginService();

	fastify.post(
		'/login',
		{
			config: {
				rateLimit: {
					max: 50,
					timeWindow: '1 minute',
				},
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const body: any = request.body;
				const { username, password } = body;

				const result: any = await loginService.checkLogin(db, username);

				if (_.isEmpty(result)) {
					return reply
						.status(StatusCodes.UNAUTHORIZED)
						.send(getReasonPhrase(StatusCodes.UNAUTHORIZED));
				}

				const hash: any = result.password;

				const match: any = await fastify.verifyPassword(password, hash);

				if (!match) {
					return reply
						.status(StatusCodes.UNAUTHORIZED)
						.send(getReasonPhrase(StatusCodes.UNAUTHORIZED));
				}

				const userId: any = result.user_id;
				const payload: any = {
					sub: userId,
					role: [result.role],
				};

				// Sign new JWT token
				const accessToken = fastify.jwt.sign(payload);
				return reply.status(StatusCodes.OK).send({ accessToken });
			} catch (error: any) {
				request.log.info(error.message);
				return reply
					.status(StatusCodes.INTERNAL_SERVER_ERROR)
					.send(error);
			}
		}
	);

	done();
};
