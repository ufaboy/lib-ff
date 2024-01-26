import { randomBytes, pbkdf2Sync } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { Authenticator, User } from '../types/user.js';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/types';
import base64url from 'base64url';

const prisma = new PrismaClient();
// Human-readable title for your website
const rpName = 'Library';
// A unique identifier for your website
const rpID = process.env.DOMEN || 'localhost';
// The URL at which registrations and authentications should occur
const origin = `http://${rpID}:5173`;

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
  const result = await prisma.authenticator.findMany({ where: { user_id: id } });
  return result.map(item => {
    // @ts-ignore:next-line
    return {...item, credentialID: base64url.decode(item.credentialID), transports: (item.transports.split(',') as AuthenticatorTransport[])}}) 
}

async function getVerifyRegistration(
  body: RegistrationResponseJSON,
  username: string
) {
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (user) {
    const expectedChallenge: string = user?.currentChallenge ?? '';
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;
    if (verified) {
      // @ts-ignore:next-line
      const {credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp,
      } = registrationInfo;
      const newAuthenticator: Authenticator = {
        credentialID,
        credentialPublicKey,
        counter,
        credentialDeviceType,
        credentialBackedUp,
        // @ts-ignore:next-line
        transports: body.response.transports,
      };
      console.log('transports:', newAuthenticator.transports)
      await prisma.authenticator.upsert({
        where: { user_id: user.id },
        // @ts-ignore:next-lin
        update: {...newAuthenticator, credentialID: base64url(credentialID), user_id: user.id, transports: newAuthenticator.transports.join(',')},
        // @ts-ignore:next-line
        create: {...newAuthenticator, credentialID: base64url(credentialID), user_id: user.id, transports: newAuthenticator.transports.join(',')},
      });
    }
    return verification;
  }
}

async function getAuthenticationOptions(username: string) {
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (user) {
    const userAuthenticators: Authenticator[] = await getUserAuthenticators(user.id);
    const options = await generateAuthenticationOptions({
      rpID,
      // Require users to use a previously-registered authenticator
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: 'public-key',
        transports: authenticator.transports,
      })),
      userVerification: 'preferred',
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentChallenge: options.challenge,
      },
    });
    return options
  } else {
    throw new Error('not founded user')
  }
}
async function getVerifyAuthentication(body: AuthenticationResponseJSON, username: string) {
  const user = await prisma.user.findUnique({ where: { username: username }, include: {
    authenticator: true
  } });
  if(user) {
    const expectedChallenge = user.currentChallenge as string;
    // @ts-ignore:next-line
    const authenticator = base64url.decode(user.authenticator) ;
    if (!authenticator) {
      throw new Error(`Could not find authenticator ${body.id} for user ${user.id}`);
    }
    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
    });

    return verification
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
  getAuthenticationOptions,
  getVerifyAuthentication
};
