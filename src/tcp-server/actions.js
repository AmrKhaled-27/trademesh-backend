import * as authController from '../modules/auth/auth.controller.js';
import * as userController from '../modules/user/user.controller.js';
import { ACTIONS } from '../utils/actionTypes.js';

export const routes = {
  [ACTIONS.AUTH_SIGNUP]: authController.handleSignup,
  [ACTIONS.AUTH_LOGIN]: authController.handleLogin,
  [ACTIONS.AUTH_VERIFY_2FA]: authController.handleVerify2FA,
  [ACTIONS.AUTH_RESEND_OTP]: authController.handleResendOtp,
  [ACTIONS.USER_GET_ME]: userController.getMe,
};
