import { registerUser, loginUser, verifyOtp, resendOtp } from './auth.service.js';
import { AppError } from '../../utils/AppError.js';

export const handleSignup = async (data) => {
  const result = await registerUser(data.body);

  return {
    statusCode: 201,
    body: {
      message: result.message,
      tempToken: result.tempToken,
    },
  };
};

export const handleLogin = async (data) => {
  const result = await loginUser(data.body);

  return {
    statusCode: 200,
    body: {
      message: result.message,
      tempToken: result.tempToken,
    },
  };
};

export const handleVerify2FA = async (data) => {
  const authHeader = data.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized: Temporary token is required in Authorization header.', 401);
  }

  const tempToken = authHeader.split(' ')[1];
  const result = await verifyOtp({ tempToken, otp: data.body.otp });

  return {
    statusCode: 200,
    body: {
      message: '2FA Verification successful',
      token: result.token,
    },
  };
};

export const handleResendOtp = async (data) => {
  const authHeader = data.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized: Temporary token is required in Authorization header.', 401);
  }

  const tempToken = authHeader.split(' ')[1];
  const result = await resendOtp({ tempToken });

  return {
    statusCode: 200,
    body: {
      message: result.message,
      tempToken: result.tempToken,
    },
  };
};
