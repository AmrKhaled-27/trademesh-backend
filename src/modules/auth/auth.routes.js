import { Router } from 'express';
import { validate } from '../../gateway/middlewares/validate.js';
import { signupDto, loginDto, verifyOtpDto } from './auth.dto.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';

const router = Router();

router.post('/signup', validate({ body: signupDto }), forwardAction(ACTIONS.AUTH_SIGNUP));
router.post('/login', validate({ body: loginDto }), forwardAction(ACTIONS.AUTH_LOGIN));
router.post(
  '/verify-2fa',
  validate({ body: verifyOtpDto }),
  forwardAction(ACTIONS.AUTH_VERIFY_2FA),
);
router.post('/resend-otp', forwardAction(ACTIONS.AUTH_RESEND_OTP));

export default router;
