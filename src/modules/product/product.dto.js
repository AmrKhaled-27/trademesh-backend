import { z } from 'zod';

export const createProductDto = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  imageUrl: z.url('Image URL must be a valid URL').optional(),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative'),
});

export const updateProductDto = z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters').optional(),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    imageUrl: z.url('Image URL must be a valid URL').optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative').optional(),
    isActive: z.boolean().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required for update',
  });

export const productParamsDto = z.object({
  id: z.string().min(1, 'Product id is required'),
});

export const listProductsQueryDto = z.object({
    search: z.string().trim().min(1, 'Search cannot be empty').optional(),
    minPrice: z.coerce.number().nonnegative('Minimum price cannot be negative').optional(),
    maxPrice: z.coerce.number().nonnegative('Maximum price cannot be negative').optional(),
    inStock: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    page: z.coerce.number().int('Page must be an integer').min(1, 'Page must be at least 1').default(1),
    limit: z.coerce
      .number()
      .int('Limit must be an integer')
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .default(10),
  })
  .refine((query) => query.minPrice === undefined || query.maxPrice === undefined || query.maxPrice >= query.minPrice, {
    message: 'maxPrice must be greater than or equal to minPrice',
    path: ['maxPrice'],
  });
