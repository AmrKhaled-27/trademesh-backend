import { Router } from 'express';
import { validate } from '../../gateway/middlewares/validate.js';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';
import { checkoutDto, checkoutParamsDto } from './checkout.dto.js';

const router = Router();

router.post(
  '/',
  authenticate,
  validate({ body: checkoutDto }),
  forwardAction(ACTIONS.CHECKOUT_CREATE),
);

router.get('/me', authenticate, forwardAction(ACTIONS.CHECKOUT_GET_ME));

router.get(
  '/:id',
  authenticate,
  validate({ params: checkoutParamsDto }),
  forwardAction(ACTIONS.CHECKOUT_GET_BY_ID),
);

export default router;
