import { registerUser, loginUser, verifyOtp, resendOtp } from './auth.service.js';

/**
 * Handles user sign up requests. First validates payload, creates user, then fires OTP email.
 *
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
export const handleSignup = async (req, res) => {
  const result = await registerUser(req.validatedBody);

  return res.status(201).json({
    message: result.message,
    tempToken: result.tempToken,
  });
};

/**
 * Handles user login requests. Validates payload, verifies local credentials, then fires OTP email.
 *
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
export const handleLogin = async (req, res) => {
  const result = await loginUser(req.validatedBody);

  return res.status(200).json({
    message: result.message,
    tempToken: result.tempToken,
  });
};

/**
 * Handles 2FA OTP verifications. Validates the payload against DB. Upon success, returns the JWT auth token.
 *
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
export const handleVerify2FA = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Temporary token is required in Authorization header.',
    });
  }

  const tempToken = authHeader.split(' ')[1];
  const result = await verifyOtp({ tempToken, otp: req.validatedBody.otp });

  return res.status(200).json({
    message: '2FA Verification successful',
    token: result.token,
  });
};

/**
 * Handles OTP resend requests for existing users.
 *
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 */
export const handleResendOtp = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Temporary token is required in Authorization header.',
    });
  }

  const tempToken = authHeader.split(' ')[1];
  const result = await resendOtp({ tempToken });

  return res.status(200).json({
    message: result.message,
    tempToken: result.tempToken,
  });
};
