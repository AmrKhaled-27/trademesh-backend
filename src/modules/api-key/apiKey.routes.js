import { Router } from 'express';
import { validate } from '../../gateway/middlewares/validate.js';
import { createApiKeyDto, revokeApiKeyParamsDto } from './apiKey.dto.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';
import { verifyApiKey } from '../../gateway/middlewares/apiKey.middleware.js';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
const router = Router();

router.post(
  '/',
  authenticate,
  validate({ body: createApiKeyDto }),
  forwardAction(ACTIONS.API_KEY_CREATE),
);

router.get('/', authenticate, forwardAction(ACTIONS.API_KEY_LIST));

router.delete(
  '/:id',
  authenticate,
  validate({ params: revokeApiKeyParamsDto }),
  forwardAction(ACTIONS.API_KEY_REVOKE),
);

export default router;
