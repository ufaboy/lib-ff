import { FastifyRequest, FastifyReply } from 'fastify';

import {
  signin,
  login,
  getRegistrationOptions,
  getVerifyRegistration,
  getAuthenticationOptions,
  getVerifyAuthentication,
} from '../services/userService.js';
import { RegistrationResponseJSONExtended, AuthenticationResponseJSONExtended } from '../types/user.js';

interface BodyType {
  username: string;
  password: string;
}
async function registerUser(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await signin(username, password);
    reply.send(user.access_token);
  } catch (error) {
    reply.code(401).send(error);
  }
}

async function loginUser(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const access_token = await login(username, password);
    reply.send({ access_token });
  } catch (error) {
    console.log({ error: error });
    reply.code(401).send(error);
  }
}

async function generateRegistrationOptions(
  req: FastifyRequest<{ Body: { username: string } }>,
  reply: FastifyReply
) {
  try {
    const result = await getRegistrationOptions(req.body.username);
    // @ts-ignore:next-line
    req.session.username = req.body.username;
    req.session.set<any>('not-exist', req.body.username);
    reply.send(result);
  } catch (error) {
    console.log({ 'generateRegistrationOptions error': error });
    reply.code(401).send(error);
  }
}
async function verifyRegistration(
  req: FastifyRequest<{ Body: RegistrationResponseJSONExtended }>,
  reply: FastifyReply
) {
  const {
    username,
    id,
    rawId,
    response,
    authenticatorAttachment,
    clientExtensionResults,
    type,
  } = req.body;
  const result = await getVerifyRegistration(
    {
      id,
      rawId,
      response,
      authenticatorAttachment,
      clientExtensionResults,
      type,
    },
    username
  );
  console.log('verifyRegistration 2', result, username);
  reply.send(result);
}

async function generateAuthenticationOptions(
  req: FastifyRequest<{ Body: { username: string } }>,
  reply: FastifyReply
) {
  try {
    const result = await getAuthenticationOptions(req.body.username);
    reply.send(result);
  } catch (error) {
    console.log({ 'generateAuthenticationOptions error': error });
    reply.code(401).send(error);
  }
}

async function verifyAuthentication(req: FastifyRequest<{ Body: AuthenticationResponseJSONExtended }>,
  reply: FastifyReply) {
  try {
    const {
      username,
      id,
      rawId,
      response,
      authenticatorAttachment,
      clientExtensionResults,
      type,
    } = req.body;
    const result = getVerifyAuthentication({
      id,
      rawId,
      response,
      authenticatorAttachment,
      clientExtensionResults,
      type,
    },
    username)
    reply.send(result);
  } catch (error) {
    console.log({ 'verifyAuthentication error': error });
    reply.code(401).send(error);
  }
}

export {
  registerUser,
  loginUser,
  generateRegistrationOptions,
  verifyRegistration,
  generateAuthenticationOptions,
  verifyAuthentication
};
