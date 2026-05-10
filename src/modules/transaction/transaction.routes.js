import { Router } from 'express';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';

const router = Router();

router.get('/me', authenticate, forwardAction(ACTIONS.TRANSACTION_GET_ME));

export default router;
