import { z } from 'zod';

export const checkoutDto = z.object({
  productId: z.number().int().positive('Product id must be a positive integer'),
});

export const checkoutParamsDto = z.object({
  id: z.string().min(1, 'Checkout id is required'),
});
