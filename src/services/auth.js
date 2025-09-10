import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';

import UsersCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/auth-constants.js';
import ContactsCollection from '../db/models/Contacts.js';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

//---------------------------------------------------------------

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  };
};

//---------------------------------------------------------------

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

//---------------------------------------------------------------

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionCollection.deleteOne({ userId: user._id });

  return SessionCollection.create({
    userId: user._id,
    ...createSession(),
  });
};

//---------------------------------------------------------------

export const logoutUser = async (userId) => {
  await SessionCollection.deleteOne({ userId });
};

//---------------------------------------------------------------

export const refreshUserSessoin = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    userId: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ userId: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...createSession(),
  });
};

//---------------------------------------------------------------

export const sendResetEmail = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign({ email }, getEnvVar('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const resetLink = `${getEnvVar(
    'APP_DOMAIN',
  )}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
  } catch (error) {
    console.error('Detailed SMTP Error:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later',
    );
  }
};
