import { FastifyPluginAsync } from 'fastify';
import {
  registerUser,
  loginUser,
  generateRegistrationOptions,
  verifyRegistration,
  generateAuthenticationOptions,
  verifyAuthentication,
} from '../../controllers/authController.js';

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/generate-registration-options', generateRegistrationOptions);
  fastify.post(
    '/generate-authentication-options',
    generateAuthenticationOptions
  );
  fastify.post('/verify-registration', verifyRegistration);
  fastify.post('/verify-authentication', verifyAuthentication);
  fastify.post('/signin', registerUser);
  fastify.post('/login', loginUser);
};

export default auth;
