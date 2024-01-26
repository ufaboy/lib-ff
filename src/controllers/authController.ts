import { FastifyRequest, FastifyReply } from 'fastify';

import {
  signin,
  login,
  getRegistrationOptions,
  getVerifyRegistration,
} from '../services/userService.js';
import { RegistrationResponseJSON } from '@simplewebauthn/types';

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
    console.log('generateRegistrationOptions 1', req.body)
    const result = await getRegistrationOptions(req.body.username);
    // @ts-ignore:next-line
    req.session.username = req.body.username
    req.session.set<any>('not-exist', req.body.username)
    reply.send(result);
  } catch (error) {
    console.log({ 'generateRegistrationOptions error': error });
    reply.code(401).send(error);
  }
}
async function verifyRegistration(
  req: FastifyRequest<{ Body: RegistrationResponseJSON }>,
  reply: FastifyReply
) {
  // @ts-ignore:next-line
  const username = req.session.get('not-exist') as string
  console.log('verifyRegistration 1', username, req.session)
  const result = await getVerifyRegistration(req.body, username)
  console.log('verifyRegistration 2', result, username)
  reply.send(result);
}

export { registerUser, loginUser, generateRegistrationOptions, verifyRegistration };
