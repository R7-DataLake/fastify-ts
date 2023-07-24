import fp from 'fastify-plugin'
import Knex from "knex"

module.exports = fp((fastify: any, opts: any, done: any) => {

  const handler = Knex(opts.options)

  fastify
    .decorate("db", handler)
    .addHook('onClose', (instance: any, done: any) => {
      if (instance.knex === handler) {
        instance.knex.destroy(done)
      };
    })

  done();

}, { fastify: '4.x', name: 'fastify/db' })