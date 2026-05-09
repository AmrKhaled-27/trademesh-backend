import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, updateUserOTP } from '../user/user.service.js';
import { sendOTP } from '../mailing/mailing.service.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 5;

/**
 * Hashes a given plain-text password using bcrypt.
 *
 * @param {string} password - The plain-text password.
 * @returns {Promise<string>} The hashed representation.
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Validates a given plain-text password against a stored hash.
 *
 * @param {string} password - The plain-text input.
 * @param {string} hash - The stored hash.
 * @returns {Promise<boolean>} True if it matches.
 */
export const matchPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generates a 6-digit OTP code.
 *
 * @returns {string} The OTP code.
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Registers a user, hashes their password, and initiates the 2FA process.
 *
 * @param {Object} userData - Expected user details (name, email, password)
 * @returns {Promise<Object>} An object to identify the user for OTP step.
 */
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError('User with this email already exists.', 409);
  }

  const hashedPassword = await hashPassword(password);

  // Creates standard user
  const newUser = await createUser({ name, email, password: hashedPassword });

  return initiateOtpForUser(newUser);
};

/**
 * Authenticates a user against local credentials and initiates the 2FA process.
 *
 * @param {Object} credentials - Expected login details (email, password)
 * @returns {Promise<Object>} An object to identify the user for OTP step.
 */
export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await matchPassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  return initiateOtpForUser(user);
};

/**
 * Resends OTP for an existing user.
 *
 * @param {Object} payload - Expected data for resending OTP.
 * @param {string} payload.tempToken - The temporary token provided during login/signup.
 * @returns {Promise<Object>} A success message for OTP step.
 */
export const resendOtp = async ({ tempToken }) => {
  let decoded;
  try {
    decoded = jwt.verify(tempToken, env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Temporary token is invalid or has expired.', 401);
  }

  if (!decoded.isTemp) {
    throw new AppError('Invalid token format.', 401);
  }

  const user = await findUserByEmail(decoded.email);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return initiateOtpForUser(user);
};

/**
 * Common flow: Generates an OTP, stores it in the database and sends via Mailing Service.
 *
 * @param {import('@prisma/client').User} user - Extracted user state.
 * @returns {Promise<Object>} The expected step message.
 */
const initiateOtpForUser = async (user) => {
  const otpCode = generateOtp();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

  await updateUserOTP(user.id, otpCode, expiresAt);
  await sendOTP(user.email, otpCode);

  const tempToken = jwt.sign(
    { email: user.email, isTemp: true },
    env.JWT_SECRET,
    { expiresIn: '10m' }, // 10 minutes temporary token
  );

  return { message: 'OTP sent to email. Please verify to proceed.', tempToken };
};

/**
 * Verifies a provided OTP against the database record and issues a JWT token.
 *
 * @param {string} tempToken - The temporary token provided during login/signup.
 * @param {string} otp - The OTP code provided.
 * @returns {Promise<Object>} Object containing the token or failing via Error.
 */
export const verifyOtp = async ({ tempToken, otp }) => {
  let decoded;
  try {
    decoded = jwt.verify(tempToken, env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Temporary token is invalid or has expired.', 401);
  }

  if (!decoded.isTemp) {
    throw new AppError('Invalid token format.', 401);
  }

  const user = await findUserByEmail(decoded.email);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // Allow '111111' for testing purposes
  if (otp === '111111') {
    // Successful verification via testing bypass: Clean up OTP from DB
    await updateUserOTP(user.id, null, null);

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { token };
  }

  if (user.otp !== otp) {
    throw new AppError('Invalid or missing OTP.', 401);
  }

  if (new Date() > new Date(user.otpExpiresAt)) {
    throw new AppError('OTP has expired.', 401);
  }

  // Successful verification: Clean up OTP from DB
  await updateUserOTP(user.id, null, null);

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.JWT_SECRET,
    { expiresIn: '1d' }, // Expires in 1 Day
  );

  return { token };
};
