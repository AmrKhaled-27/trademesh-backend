import { Router } from 'express';
import { authenticate } from '../../gateway/middlewares/authenticate.js';
import { validate } from '../../gateway/middlewares/validate.js';
import { forwardAction } from '../../gateway/forwarder.js';
import { ACTIONS } from '../../utils/actionTypes.js';
import { salesChartQueryDto } from './reports.dto.js';

const router = Router();

// GET /api/reports/financial-summary
router.get('/financial-summary', authenticate, forwardAction(ACTIONS.REPORTS_GET_SUMMARY));

// GET /api/reports/sales-chart?days=30
router.get(
  '/sales-chart',
  authenticate,
  validate({ query: salesChartQueryDto }),
  forwardAction(ACTIONS.REPORTS_GET_SALES_CHART),
);

// GET /api/reports/top-products
router.get('/top-products', authenticate, forwardAction(ACTIONS.REPORTS_GET_TOP_PRODUCTS));

export default router;
