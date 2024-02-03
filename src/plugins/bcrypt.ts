import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp(async (fastify, opts) => {
	// hash password
	fastify.decorate('hashPassword', (password: any) => {
		const saltRounds = 12;
		return bcrypt.hash(password, saltRounds);
	});

	// verify password
	fastify.decorate('verifyPassword', (password: any, hash: any) => {
		return bcrypt.compare(password, hash);
	});
});
