import { prisma } from '../../utils/prisma.js';

/**
 * Find a user by their email address.
 *
 * @param {string} email - The email to search for.
 * @returns {Promise<import('@prisma/client').User|null>} - Returns the user if found.
 */
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Creates a new user in the database.
 *
 * @param {Object} userData - Form data for new user setup.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.name - The user's name.
 * @param {string} userData.password - The parsed/hashed password.
 * @returns {Promise<import('@prisma/client').User>} - The newly created user object.
 */
export const createUser = async ({ email, name, password }) => {
  return prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });
};

/**
 * Find a user by their unique ID.
 *
 * @param {string} id - The unique user identifier.
 * @returns {Promise<import('@prisma/client').User|null>} - Returns the user if found.
 */
export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Updates a user's OTP fields in the database.
 *
 * @param {string} userId - The user ID in the database.
 * @param {string|null} otp - The OTP generated, or null to clear it.
 * @param {Date|null} otpExpiresAt - Expiry date/time, or null to clear.
 * @returns {Promise<import('@prisma/client').User>}
 */
export const updateUserOTP = async (userId, otp, otpExpiresAt) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      otp,
      otpExpiresAt,
    },
  });
};
