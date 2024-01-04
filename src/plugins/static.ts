import fp from 'fastify-plugin';
import { fastifyStatic } from '@fastify/static';
import path from 'path';

export default fp(async (fastify) => {
  const __dirname = process.env.STORAGE_DIR as string
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '/storage'),
  });
});
