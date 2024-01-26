import fp from 'fastify-plugin';
import fastifySession from '@fastify/session';

export default fp(async (fastify) => {
  fastify.register(fastifySession, {
    cookieName: 'userId',
    secret: 'vkejbgfk3fbhbtjh2vbrhvb2hjrvbjfv2kgucguqgf7r329ery019u90u9hfhb13br84ty18gev13hbi17fg13',
    cookie: { maxAge: 1800000, secure: false }
  });
});
