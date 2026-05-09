import { z } from 'zod';

export const checkoutDto = z.object({
  productId: z.number().int().positive(),
});

export const transactionIdParamsDto = z.object({
  id: z.coerce.number().int().positive(),
});

export const userTransactionsParamsDto = z.object({
  userId: z.coerce.number().int().positive(),
});