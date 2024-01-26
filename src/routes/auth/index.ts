import { FastifyPluginAsync } from "fastify"
import { registerUser, loginUser, generateRegistrationOptions, verifyRegistration } from '../../controllers/authController.js';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/generate-registration-options', generateRegistrationOptions);
  fastify.post('/generate-authentication-options', registerUser);
  fastify.post('/verify-registration', verifyRegistration);
  fastify.post('/verify-authentication', registerUser);
  fastify.post('/signin', registerUser);
  fastify.post('/login', loginUser);
}

export default auth;