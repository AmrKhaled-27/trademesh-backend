import { z } from 'zod';

export const depositDto = z.object({
  amount: z.number().positive('Amount must be greater than 0'),

  cardNumber: z.string().min(12, 'Card number must be at least 12 digits'),

  cvv: z.string().min(3, 'CVV must be 3 or 4 digits').max(4, 'CVV must be 3 or 4 digits'),

  expiryDate: z.string().min(4, 'Expiry date is required, example: 12/27'),
});

export const withdrawDto = z.object({
  amount: z.number().positive('Amount must be greater than 0'),

  bankAccountNumber: z.string().min(8, 'Bank account number must be at least 8 digits'),
});
