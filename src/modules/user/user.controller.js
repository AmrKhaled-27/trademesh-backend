import * as userService from './user.service.js';

export const getMe = async (data) => {
  const userId = data.user.id;
  const user = await userService.findUserById(userId);

  // Remove sensitive data before returning
  const { password, otp, otpExpiresAt, ...safeUser } = user;

  return {
    statusCode: 200,
    body: {
      message: 'User profile retrieved successfully',
      user: safeUser,
    },
  };
};
