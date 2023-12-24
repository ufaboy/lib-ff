import { FastifyPluginAsync } from "fastify"
import { registerUser, loginUser } from '../../controllers/authController.js';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/signin', registerUser);
  fastify.post('/login', loginUser);
}

export default auth;
