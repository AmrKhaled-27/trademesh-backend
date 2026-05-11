import * as authController from '../modules/auth/auth.controller.js';
import * as userController from '../modules/user/user.controller.js';
import * as apiKeyController from '../modules/api-key/apiKey.controller.js';
import * as productController from '../modules/product/product.controller.js';
import * as walletController from '../modules/wallet/wallet.controller.js';
import * as checkoutController from '../modules/checkout/checkout.controller.js';
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
  [ACTIONS.PRODUCT_GET_ME]: productController.handleGetMyProducts,
  [ACTIONS.PRODUCT_GET_BY_ID]: productController.handleGetProductById,
  [ACTIONS.PRODUCT_UPDATE]: productController.handleUpdateProduct,
  [ACTIONS.PRODUCT_DELETE]: productController.handleDeleteProduct,
  [ACTIONS.WALLET_DEPOSIT]: walletController.handleDeposit,
  [ACTIONS.WALLET_WITHDRAW]: walletController.handleWithdraw,

  [ACTIONS.CHECKOUT_CREATE]: checkoutController.handleCheckout,
  [ACTIONS.CHECKOUT_GET_ME]: checkoutController.handleGetMyCheckouts,
  [ACTIONS.CHECKOUT_GET_BY_ID]: checkoutController.handleGetCheckoutById,
};
