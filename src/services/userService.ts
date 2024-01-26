import { randomBytes, pbkdf2Sync } from 'crypto';
import { PrismaClient } from '@prisma/client';
import {
  Authenticator,
  User,
} from '../types/user.js';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { RegistrationResponseJSON } from '@simplewebauthn/types';

const prisma = new PrismaClient();
// Human-readable title for your website
const rpName = 'Library';
// A unique identifier for your website
const rpID = process.env.DOMEN || 'localhost';
// The URL at which registrations and authentications should occur
const origin = `https://${rpID}`;

async function getRegistrationOptions(username: string) {
  const user = await prisma.user.create({
    data: {
      username,
      password: 'hash',
      salt: 'salt',
      role: 'super',
      access_token: generateRandomString(32),
    },
  });
  // const userAuthenticators: Authenticator[] = await getUserAuthenticators(user.id);
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: String(user.id),
    userName: user.username,
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    /*     excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: 'public-key',

    })), */
    // See "Guiding use of authenticators via authenticatorSelection" below
    authenticatorSelection: {
      // Defaults
      residentKey: 'preferred',
      userVerification: 'preferred',
      // Optional
      authenticatorAttachment: 'cross-platform',
    },
  });

  // (Pseudocode) Remember the challenge for this user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      currentChallenge: options.challenge,
    },
  });

  return options;
}

async function getUserAuthenticators(id: number) {
  return await prisma.authenticator.findMany({ where: { user_id: id } });
}

async function getVerifyRegistration(body: RegistrationResponseJSON, username: string) {
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (user) {
    const expectedChallenge: string = user?.currentChallenge ?? '';
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
    console.log('getVerifyRegistration', verification);
    const { verified, registrationInfo } = verification;
    // @ts-ignore:next-line
    const { credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp,} = registrationInfo;
    const newAuthenticator: Authenticator = {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
      // `body` here is from Step 2
      // transports: body.response.transports,
    };
    await prisma.authenticator.update({
      where: { user_id: user.id },
      data: {...newAuthenticator},
    });
    return verification.verified;
  }
}

async function signin(username: string, password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  const access_token = generateRandomString(32);

  const user = await prisma.user.create({
    data: { username, password: hash, salt, role: 'super', access_token },
  });
  return user;
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
  getRegistrationOptions,
  getVerifyRegistration,
};
