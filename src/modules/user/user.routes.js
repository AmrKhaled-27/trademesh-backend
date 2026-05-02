import { Router } from 'express';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';

const router = Router();

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, forwardAction(ACTIONS.USER_GET_ME));

export default router;
