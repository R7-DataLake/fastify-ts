import fp from 'fastify-plugin';
import Knex from 'knex';

export default fp(async (fastify) => {
	if (!fastify.db) {
		const knex = Knex({
			client: 'mysql2',
			connection: {
				host: process.env.DB_HOST || 'localhost',
				port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
				database: process.env.DB_NAME || 'test',
				user: process.env.DB_USER || 'root',
				password: process.env.DB_PASSWORD || '123456',
			},
			debug: process.env.NODE_ENV === 'development',
			pool: {
				min: 2,
				max: 10,
			},
		});

		fastify.decorate('db', knex);

		fastify.addHook('onClose', (fastify, done) => {
			if (fastify.db === knex) {
				fastify.db.destroy(done);
			}
		});
	}
});
