import { Router } from 'express';
import { handleSignup, handleLogin, handleVerify2FA, handleResendOtp } from './auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import { signupDto, loginDto, verifyOtpDto } from './auth.dto.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.post('/signup', validate({ body: signupDto }), asyncHandler(handleSignup));
router.post('/login', validate({ body: loginDto }), asyncHandler(handleLogin));
router.post('/verify-2fa', validate({ body: verifyOtpDto }), asyncHandler(handleVerify2FA));
router.post('/resend-otp', asyncHandler(handleResendOtp));

export default router;
