import { z } from 'zod';

/**
 * Query DTO for the sales-over-time chart endpoint.
 * Accepts an optional `days` parameter (defaults to 30).
 */
export const salesChartQueryDto = z.object({
  days: z
    .string()
    .optional()
    .default('30')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !Number.isNaN(val) && val >= 1 && val <= 365, {
      message: 'days must be a number between 1 and 365',
    }),
});
