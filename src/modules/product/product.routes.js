import { Router } from 'express';
import { validate } from '../../gateway/middlewares/validate.js';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { uploadCsv, parseCsv } from '../../gateway/middlewares/csv-upload.js';
import { ACTIONS } from '../../utils/actionTypes.js';
import {
  createProductDto,
  listProductsQueryDto,
  productParamsDto,
  updateProductDto,
} from './product.dto.js';

const router = Router();

router.post(
  '/',
  authenticate,
  validate({ body: createProductDto }),
  forwardAction(ACTIONS.PRODUCT_CREATE),
);

router.post('/bulk', authenticate, uploadCsv, parseCsv, forwardAction(ACTIONS.PRODUCT_BULK_CREATE));

router.get('/', validate({ query: listProductsQueryDto }), forwardAction(ACTIONS.PRODUCT_LIST));
router.get('/me', authenticate, forwardAction(ACTIONS.PRODUCT_GET_ME));
router.get(
  '/:id',
  validate({ params: productParamsDto }),
  forwardAction(ACTIONS.PRODUCT_GET_BY_ID),
);

router.patch(
  '/:id',
  authenticate,
  validate({ params: productParamsDto, body: updateProductDto }),
  forwardAction(ACTIONS.PRODUCT_UPDATE),
);

router.delete(
  '/:id',
  authenticate,
  validate({ params: productParamsDto }),
  forwardAction(ACTIONS.PRODUCT_DELETE),
);

export default router;
