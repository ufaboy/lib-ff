import fp from 'fastify-plugin';
import { fastifyStatic } from '@fastify/static';

export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: '/app/storage',
  });
});
