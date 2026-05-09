import * as authController from '../modules/auth/auth.controller.js';
import * as userController from '../modules/user/user.controller.js';
import * as apiKeyController from '../modules/api-key/apiKey.controller.js';
import { ACTIONS } from '../utils/actionTypes.js';
import * as transactionController from '../modules/transaction/transaction.controller.js';

export const routes = {
  [ACTIONS.AUTH_SIGNUP]: authController.handleSignup,
  [ACTIONS.AUTH_LOGIN]: authController.handleLogin,
  [ACTIONS.AUTH_VERIFY_2FA]: authController.handleVerify2FA,
  [ACTIONS.AUTH_RESEND_OTP]: authController.handleResendOtp,
  [ACTIONS.USER_GET_ME]: userController.getMe,
  [ACTIONS.API_KEY_CREATE]: apiKeyController.handleCreateApiKey,
  [ACTIONS.API_KEY_LIST]: apiKeyController.handleListApiKeys,
  [ACTIONS.API_KEY_REVOKE]: apiKeyController.handleRevokeApiKey,
  [ACTIONS.TRANSACTION_CHECKOUT]: transactionController.checkout,
  [ACTIONS.TRANSACTION_GET_BY_ID]: transactionController.getTransactionById,
  [ACTIONS.TRANSACTION_GET_USER_TRANSACTIONS]: transactionController.getUserTransactions,
};
