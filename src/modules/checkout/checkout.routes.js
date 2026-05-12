import express from 'express';
import * as checkoutController from './checkout.controller.js';
import { checkoutSchema } from './checkout.dto.js';
import { validate } from '../../gateway/middlewares/validate.js';
import { authenticate } from '../../gateway/middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validate({ body: checkoutSchema }), checkoutController.checkout);

export default router;
