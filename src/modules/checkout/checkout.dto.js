import { z } from 'zod';

export const checkoutSchema = z.object({
  productId: z.number().int().positive(),
  cardInfo: z.object({
    cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
    cardHolder: z.string().min(3),
    cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  }),
});
