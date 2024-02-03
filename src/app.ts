import fastify from 'fastify';
import path from 'path';

import autoload from '@fastify/autoload';

const app = fastify({
	logger: {
		level: process.env.NODE_ENV === 'development' ? 'info' : 'error',
		transport:
			process.env.NODE_ENV === 'development'
				? {
						target: 'pino-pretty',
						options: {
							translateTime: 'HH:MM:ss Z',
							ignore: 'pid,hostname',
							colorize: true,
						},
				  }
				: undefined,
	},
});

app.register(require('@fastify/formbody'));
app.register(require('@fastify/cors'), {
	origin: ['http://localhost:4200', 'https://r7.moph.go.th'],
	methods: ['GET', 'POST', 'DELETE', 'PUT'],
});

// plugins
app.register(autoload, {
	dir: path.join(__dirname, 'plugins'),
});

// routes
app.register(autoload, {
	dir: path.join(__dirname, 'routes'),
	// dirNameRoutePrefix: false,
});

export default app;
