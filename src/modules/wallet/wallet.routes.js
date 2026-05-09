import { Router } from 'express';
import { validate } from '../../gateway/middlewares/validate.js';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';
import { depositDto, withdrawDto } from './wallet.dto.js';

const router = Router();

router.post(
  '/deposit',
  authenticate,
  validate({ body: depositDto }),
  forwardAction(ACTIONS.WALLET_DEPOSIT),
);

router.post(
  '/withdraw',
  authenticate,
  validate({ body: withdrawDto }),
  forwardAction(ACTIONS.WALLET_WITHDRAW),
);

export default router;
