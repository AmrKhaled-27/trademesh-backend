import { Router } from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, asyncHandler(userController.getMe));

export default router;
