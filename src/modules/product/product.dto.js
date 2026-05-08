import { z } from 'zod';

export const createProductDto = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  mainImage: z.string().url('Main image URL must be a valid URL').optional(),
  images: z.array(z.string().url('Image URL must be a valid URL')).optional().default([]),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().positive('Price must be greater than 0'),
});

export const updateProductDto = z
  .object({
    name: z.string().min(2, 'Product name must be at least 2 characters').optional(),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    mainImage: z.string().url('Main image URL must be a valid URL').optional(),
    images: z.array(z.string().url('Image URL must be a valid URL')).optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field is required for update',
  });

export const productParamsDto = z.object({
  id: z.string().min(1, 'Product id is required'),
});

export const listProductsQueryDto = z.object({
  search: z.string().trim().min(1, 'Search cannot be empty').optional(),
  brand: z.string().optional(),
});
