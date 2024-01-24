import { randomBytes, pbkdf2Sync } from 'crypto';
import { PrismaClient } from '@prisma/client';
import {
  arrayBufferToBase64,
  generateRandomChallengeString,
  base64ToArrayBuffer,
} from '../utils/helper.js';
import { SignInVerificationData, User } from '../types/user.js';

const prisma = new PrismaClient();
const expectedOrigin = process.env.BASE_URL as string

async function signin(data: SignInVerificationData) {
  const {id, rawId, username, response} = data
  const {clientDataJSON: clientDataJSONBuffer, attestationObject } = response
  const clientDataJSONString = clientDataJSONBuffer.toString();
  const clientData = JSON.parse(clientDataJSONString);
  console.log('signin', clientData)

  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  });
  if(user) {
    if (clientData.type !== 'webauthn.create') {
      throw new Error('Invalid type in clientData');
    }
    if (clientData.origin !== expectedOrigin) {
      throw new Error('Invalid origin in clientData');
    }
    const expectedChallenge = user.access_token
    if (clientData.challenge !== expectedChallenge) {
      throw new Error('Challenge does not match');
    }
  }
  return user;
}
async function register(username: string, password: string) {
  const challenge = Uint8Array.from(randomBytes(32).toString('base64'), (c) =>
    c.charCodeAt(0)
  );
  const challengeBase64 = arrayBufferToBase64(challenge);
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  const user = await prisma.user.create({
    data: {
      username,
      password: hash,
      salt,
      role: 'super',
      access_token: challengeBase64,
    },
  });
  // return user.access_token

  const userID = Uint8Array.from(String(user.id), (c) => c.charCodeAt(0));
  return {
    challenge: challengeBase64,
    rp: {
      name: 'Library',
      id: expectedOrigin,
    },
    user: {
      id: arrayBufferToBase64(userID),
      name: user.username,
      displayName: user.username,
    },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform',
    },
    timeout: 60000, // таймаут ожидания ответа (в миллисекундах)
    excludeCredentials: [], // список учетных данных, которые следует исключить
    attestation: 'direct',
    extensions: {
      credProps: true, // если true, возвращаются свойства учетных данных
    },
  };
}

async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username: username } });
  const validUser = await validPassword(user, password);
  if (user && validUser) {
    return user.access_token;
  }
  throw new Error('user not found');
}

async function validPassword(user: User | null, password: string) {
  if (user === null) return false;
  const hash = pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(
    `hex`
  );
  return user.password === hash;
}

async function validToken(token: string) {
  return await prisma.user.findFirst({ where: { access_token: token } });
}

function generateRandomString(length: number): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex') // конвертируем в шестнадцатеричный формат
    .slice(0, length); // обрезаем до нужной длины
}

export {
  signin,
  login,
  validToken,
  generateRandomChallengeString,
  register,
  base64ToArrayBuffer,
};
