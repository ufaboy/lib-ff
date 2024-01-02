import { FastifyRequest, FastifyReply } from 'fastify';
import { signin, login } from '../services/userService.js';

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

export { registerUser, loginUser };
