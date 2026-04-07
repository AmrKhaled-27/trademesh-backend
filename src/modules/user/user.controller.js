import * as userService from './user.service.js';

export const getMe = async (req, res) => {
  const userId = req.user.id;
  const user = await userService.findUserById(userId);

  // Remove sensitive data before returning
  const { password, otp, otpExpiresAt, ...safeUser } = user;

  res.status(200).json({
    message: 'User profile retrieved successfully',
    user: safeUser,
  });
};
