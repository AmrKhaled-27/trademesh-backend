import { z } from 'zod';

export const checkoutSchema = z.object({
  productId: z.number().int().positive(),
});
