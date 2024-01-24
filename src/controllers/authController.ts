import { FastifyRequest, FastifyReply } from 'fastify';
import { signin, login, register, base64ToArrayBuffer } from '../services/userService.js';
import {SignInRequestBody, SignInVerificationData} from '../types/user.js'

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
    // const user = await signin(username, password);
    const options = await register(username, password);
    reply.send(options);
  } catch (error) {
    reply.code(401).send(error);
  }
}

async function signinUser(
  req: FastifyRequest<{ Body: SignInRequestBody }>,
  reply: FastifyReply
) {
  try {
    const {id, rawId, username, response} = req.body;
    const data: SignInVerificationData = {
      id, username, rawId: base64ToArrayBuffer(rawId), response: {
        ...response, attestationObject: base64ToArrayBuffer(response.attestationObject), clientDataJSON: base64ToArrayBuffer(response.clientDataJSON)
      }
    }
    const access_token = await signin(data);
    reply.send({ access_token });
  } catch (error) {
    console.log({ error: error });
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


export { registerUser, loginUser, signinUser };
