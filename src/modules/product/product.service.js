import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const createProduct = async (payload, ownerId) => {
  return prisma.product.create({
    data: {
      ...payload,
      ownerId,
    },
  });
};

export const listProducts = async (query) => {
  const { search, minPrice, maxPrice, inStock, page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStock === true) {
    where.stock = { gt: 0 };
  }

  if (inStock === false) {
    where.stock = { lte: 0 };
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const findProductById = async (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    throw new AppError('Invalid product id', 400);
  }

  const product = await prisma.product.findFirst({
    where: {
      id: numericId,
      isActive: true,
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const updateProduct = async (id, payload, ownerId) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    throw new AppError('Invalid product id', 400);
  }

  const existing = await prisma.product.findFirst({
    where: {
      id: numericId,
      ownerId,
      isActive: true,
    },
  });

  if (!existing) {
    throw new AppError('Product not found', 404);
  }

  return prisma.product.update({
    where: { id: numericId },
    data: payload,
  });
};

export const deleteProduct = async (id, ownerId) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    throw new AppError('Invalid product id', 400);
  }

  const existing = await prisma.product.findFirst({
    where: {
      id: numericId,
      ownerId,
      isActive: true,
    },
  });

  if (!existing) {
    throw new AppError('Product not found', 404);
  }

  return prisma.product.update({
    where: { id: numericId },
    data: { isActive: false },
  });
};
