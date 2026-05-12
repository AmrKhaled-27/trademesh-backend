import checkoutService from './checkout.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const checkout = asyncHandler(async (req, res) => {
  const buyerId = req.user.id;
  const result = await checkoutService.checkout(buyerId, req.validatedBody || req.body);

  res.status(200).json({
    status: 'success',
    data: {
      product: result,
    },
  });
});
