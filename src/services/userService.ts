import { randomBytes, pbkdf2Sync } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { User } from '../types/user.js';

const prisma = new PrismaClient();

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
  const user = await prisma.user.findUnique({ where: { 'username': username } });
  const validUser = await validPassword(user, password)
  if (user && validUser) {
    return user.access_token;
  }
  throw new Error('user not found');
}

async function validPassword(user: User | null, password: string) {
  if(user === null) return false;
  const hash = pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(
    `hex`
  );
  return user.password === hash;
}

async function validToken(token: string) {
  return await prisma.user.findFirst({ where: { 'access_token': token } });
}

function generateRandomString(length: number): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex') // конвертируем в шестнадцатеричный формат
    .slice(0, length); // обрезаем до нужной длины
}

export { signin, login, validToken };
