import * as authController from '../modules/auth/auth.controller.js';
import * as userController from '../modules/user/user.controller.js';
import * as apiKeyController from '../modules/api-key/apiKey.controller.js';
import * as productController from '../modules/product/product.controller.js';
import { ACTIONS } from '../utils/actionTypes.js';

export const routes = {
  [ACTIONS.AUTH_SIGNUP]: authController.handleSignup,
  [ACTIONS.AUTH_LOGIN]: authController.handleLogin,
  [ACTIONS.AUTH_VERIFY_2FA]: authController.handleVerify2FA,
  [ACTIONS.AUTH_RESEND_OTP]: authController.handleResendOtp,
  [ACTIONS.USER_GET_ME]: userController.getMe,
  [ACTIONS.API_KEY_CREATE]: apiKeyController.handleCreateApiKey,
  [ACTIONS.API_KEY_LIST]: apiKeyController.handleListApiKeys,
  [ACTIONS.API_KEY_REVOKE]: apiKeyController.handleRevokeApiKey,
  [ACTIONS.PRODUCT_CREATE]: productController.handleCreateProduct,
  [ACTIONS.PRODUCT_LIST]: productController.handleListProducts,
  [ACTIONS.PRODUCT_GET_BY_ID]: productController.handleGetProductById,
  [ACTIONS.PRODUCT_UPDATE]: productController.handleUpdateProduct,
  [ACTIONS.PRODUCT_DELETE]: productController.handleDeleteProduct,
};
