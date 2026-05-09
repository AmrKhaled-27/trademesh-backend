import { Router } from 'express';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
import { validate } from '../../gateway/middlewares/validate.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';

import {
  checkoutDto,
  transactionIdParamsDto,
  userTransactionsParamsDto,
} from './transaction.dto.js';

const router = Router();

// POST /api/transactions/checkout
router.post(
  '/checkout',
  authenticate,
  validate({ body: checkoutDto }),
  forwardAction(ACTIONS.TRANSACTION_CHECKOUT),
);

// GET /api/transactions/:id
router.get(
  '/:id',
  authenticate,
  validate({ params: transactionIdParamsDto }),
  forwardAction(ACTIONS.TRANSACTION_GET_BY_ID),
);

// GET /api/transactions/user/:userId
router.get(
  '/user/:userId',
  authenticate,
  validate({ params: userTransactionsParamsDto }),
  forwardAction(ACTIONS.TRANSACTION_GET_USER_TRANSACTIONS),
);

export default router;