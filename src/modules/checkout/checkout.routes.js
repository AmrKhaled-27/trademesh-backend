import express from 'express';
import * as checkoutController from './checkout.controller.js';
import { checkoutSchema } from './checkout.dto.js';
import { validate } from '../../gateway/middlewares/validate.js';
import { apiKeyOrAuth } from '../../gateway/middlewares/api-key-or-auth.js';

const router = express.Router();

router.use(apiKeyOrAuth);

router.post('/', validate({ body: checkoutSchema }), checkoutController.checkout);

export default router;
