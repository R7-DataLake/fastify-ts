import bcrypt from 'bcrypt';
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
            colorize: true
          }
        }
        : undefined
  }
});

app.register(require('@fastify/formbody'));
app.register(require('@fastify/cors'), {
  origin: ['http://localhost:4200', 'https://r7.moph.go.th'],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
});

// Rate limit
app.register(import('@fastify/rate-limit'), {
  global: true,
  max: 100,
  timeWindow: '1 minute'
});

// Guard
app.register(
  require('fastify-guard'),
  {
    errorHandler: (_result: any, _request: any, reply: any) => {
      return reply
        .status(405)
        .send({
          ok: false,
          code: 405,
          error: 'You are not allowed to call this route'
        });
    }
  }
);

// Database connection
app.register(require('./plugins/db'), {
  options: {
    client: 'pg', // mysql2
    connection: {
      host: process.env.API_DB_HOST || 'localhost',
      user: process.env.API_DB_USER || 'postgres',
      port: Number(process.env.API_DB_PORT) || 5432,
      password: process.env.API_DB_PASSWORD || '',
      database: process.env.API_DB_NAME || 'test',
    },
    searchPath: [process.env.API_DB_SCHEMA || 'public'],
    pool: {
      min: Number(process.env.API_DB_POOL_MIN) || 0,
      max: Number(process.env.API_DB_POOL_MAX) || 10
    },
    debug: process.env.NODE_ENV === "development" ? true : false,
  }
})

// JWT
app.register(require('@fastify/jwt'), {
  secret: process.env.API_SECRET_KEY,
  sign: {
    iss: 'test.demo.dev',
    expiresIn: '15m'
  },
  messages: {
    badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
    noAuthorizationInHeaderMessage: 'Autorization header is missing!',
    authorizationTokenExpiredMessage: 'Authorization token expired',
    authorizationTokenInvalid: (err: any) => {
      return `Authorization token is invalid: ${err.message}`;
    }
  }
});

app.decorate('hashPassword', async (password: any) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
});

// verify password
app.decorate('verifyPassword', async (password: any, hash: any) => {
  return bcrypt.compare(password, hash);
});

app.register(require('fastify-axios'), {
  clients: {
    // const { dataV1, statusV1 } = await fastify.axios.v1.get('/ping')
    v1: {
      baseURL: 'https://v1.example.com',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJxyz'
      }
    },
    // const { dataV2, statusV2 } = await fastify.axios.v2.get('/ping')
    v2: {
      baseURL: 'https://v2.example.com',
      headers: {
        'Authorization': 'Bearer UtOkO3UI9lPY1h3h9ygTn8pD0Va2pFDcWCNbSKlf2HE'
      }
    }
  }
});

// routes
app.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  dirNameRoutePrefix: false
});

export default app;
