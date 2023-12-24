import { FastifyRequest, FastifyReply } from 'fastify';
import { signin, login } from '../services/userService.js';

interface BodyType {
  username: { value: string };
  password: { value: string };
}
async function registerUser(
  req: FastifyRequest<{ Body: BodyType }>,
  reply: FastifyReply
) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await signin(username.value, password.value);
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
    // console.log({username:username, password:password})
    const access_token = await login(username.value, password.value);
    reply.send({ access_token });
  } catch (error) {
    console.log({ error: error });
    reply.code(401).send(error);
  }
}

export { registerUser, loginUser };
