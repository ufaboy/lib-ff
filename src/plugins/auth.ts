import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { validToken } from '../services/userService.js';

export default fp(async (fastify: FastifyInstance) => {
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.routeOptions.url.startsWith('/api/auth/')) {
        return;
      }
      const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      if (!methods.includes(request.method)) {
        return;
      }
      const authorization = request.headers.authorization;
      if (!authorization) {
        return reply
          .status(401)
          .send({ error: 'Authorization header is missing' });
      }

      const token = authorization.split(' ')[1];
      const isValidtoken = await validToken(token);
      if (!isValidtoken) {
        return reply.status(403).send({ error: 'Invalid token' });
      }
    }
  );
});
