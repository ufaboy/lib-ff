import { FastifyPluginAsync } from "fastify"
import { registerUser, loginUser, signinUser } from '../../controllers/authController.js';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/register', registerUser);
  fastify.post('/signin', signinUser);
  fastify.post('/login', loginUser);
}

export default auth;
