import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { DateTime } from 'luxon';

import { UserModel } from '../../models/user';
import addSchema from '../../schema/user/add';
import listSchema from '../../schema/user/list';
import updateSchema from '../../schema/user/update';
import changePasswordSchema from '../../schema/user/changePassword';

export default async (fastify: FastifyInstance, options: any, done: any) => {
	const db = fastify.db;
	const userModel = new UserModel();

	fastify.get(
		'/',
		{
			preHandler: [fastify.guard.role('ADMIN')],
			schema: listSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const _query: any = request.query;
				const { limit, offset, query } = _query;
				const _limit = limit ?? '20';
				const _offset = offset ?? '0';

				const data: any = await userModel.list(
					db,
					query,
					Number(_limit),
					Number(_offset)
				);
				const rsTotal: any = await userModel.listTotal(db, query);

				return reply.status(StatusCodes.OK).send({
					status: 'ok',
					data,
					total: Number(rsTotal[0].total),
				});
			} catch (error: any) {
				request.log.error(error);
				return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
					status: 'error',
					error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				});
			}
		}
	);

	// New
	fastify.post(
		'/',
		{
			preHandler: [fastify.guard.role('ADMIN')],
			schema: addSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const body: any = request.body;
				const {
					username,
					password,
					firstName,
					lastName,
					enabled,
					role,
				} = body;
				const hash = await fastify.hashPassword(password);
				const _enabled = enabled === 'Y' ? true : false;

				const data: any = {
					username: username,
					password: hash,
					first_name: firstName,
					last_name: lastName,
					enabled: _enabled,
					role: role,
				};

				await userModel.save(db, data);
				return reply.status(StatusCodes.OK).send({ status: 'ok' });
			} catch (error: any) {
				request.log.error(error);
				return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
					status: 'error',
					error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				});
			}
		}
	);

	// Update
	fastify.put(
		'/:userId/update',
		{
			preHandler: [fastify.guard.role('ADMIN')],
			schema: updateSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const params: any = request.params;
				const { userId } = params;

				const body: any = request.body;
				const { firstName, lastName, enabled, role } = body;

				const now = DateTime.now().setZone('Asia/Bangkok');
				const _enabled = enabled === 'Y' ? true : false;

				const data: any = {
					first_name: firstName,
					last_name: lastName,
					role: role,
					enabled: _enabled,
					updated_at: now,
				};

				await userModel.update(db, userId, data);
				return reply.status(StatusCodes.OK).send({ status: 'ok' });
			} catch (error: any) {
				request.log.error(error);
				return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
					status: 'error',
					error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				});
			}
		}
	);

	// Change password
	fastify.put(
		'/:userId/change-password',
		{
			preHandler: [fastify.guard.role('ADMIN')],
			schema: changePasswordSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const params: any = request.params;
				const { userId } = params;

				const body: any = request.body;
				const { password } = body;

				const hash = await fastify.hashPassword(password);
				const now = DateTime.now().setZone('Asia/Bangkok');

				const data: any = {
					password: hash,
					updated_at: now,
				};

				await userModel.update(db, userId, data);
				return reply.status(StatusCodes.OK).send({ status: 'ok' });
			} catch (error: any) {
				request.log.error(error);
				return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
					status: 'error',
					error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				});
			}
		}
	);

	// Remove
	fastify.delete(
		'/:userId/delete',
		{
			preHandler: [fastify.guard.role('ADMIN')],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const params: any = request.params;
				const { userId } = params;

				await userModel.remove(db, userId);
				return reply.status(StatusCodes.OK).send({ status: 'ok' });
			} catch (error: any) {
				request.log.error(error);
				return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
					status: 'error',
					error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				});
			}
		}
	);

	// Info
	fastify.get(
		'/:userId/info',
		{
			preHandler: [fastify.guard.role('ADMIN')],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const params: any = request.params;
				const { userId } = params;

				const result: any = await userModel.info(db, userId);
				if (!_.isEmpty(result)) {
					delete result.password;
					return reply.status(StatusCodes.OK).send(result);
				} else {
					return reply.status(StatusCodes.NOT_FOUND).send({
						status: 'error',
						error: getReasonPhrase(StatusCodes.NOT_FOUND),
					});
				}
			} catch (error: any) {
				request.log.error(error);
				return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
					status: 'error',
					error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
				});
			}
		}
	);

	done();
};
