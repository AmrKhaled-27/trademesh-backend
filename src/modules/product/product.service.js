import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';

// Helper function to validate and convert product ID to a number
const toNumericProductId = (id) => {
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    throw new AppError('Invalid product id', 400);
  }

  return numericId;
};

// Helper function to get the appropriate Prisma client (transactional or regular)
const getDbClient = (transactionClient = null) => {
  return transactionClient || prisma;
};

export const createProduct = async (payload, ownerId) => {
  return prisma.product.create({
    data: {
      ...payload,
      ownerId,
    },
  });
};

export const listProducts = async (query) => {
  const { search, brand } = query;

  const where = {
    status: 'for_sale',
  };

  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  if (brand) {
    where.brand = { contains: brand, mode: 'insensitive' };
  }

  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      mainImage: true,
      price: true,
      brand: true,
      status: true,
    },
  });

  return items;
};

export const getMyProducts = async (userId) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { ownerId: userId }, // Sold or for sale
        { buyerId: userId }, // Bought
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  return products;
};

export const findProductById = async (id, transactionClient = null) => {
  const numericId = toNumericProductId(id);
  const db = getDbClient(transactionClient);

  const product = await db.product.findFirst({
    where: {
      id: numericId,
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
    },
  });

  if (!existing) {
    throw new AppError('Product not found', 404);
  }

  return prisma.product.delete({
    where: { id: numericId },
  });
};

export const markProductAsSold = async (id, buyerId, transactionClient = null) => {
  const numericId = toNumericProductId(id);
  const db = getDbClient(transactionClient);

  const updateResult = await db.product.updateMany({
    where: {
      id: numericId,
      status: 'for_sale',
      buyerId: null,
    },
    data: {
      status: 'sold',
      buyerId,
    },
  });

  if (updateResult.count === 0) {
    throw new AppError('Product is not available for checkout', 409);
  }

  return db.product.findUnique({
    where: { id: numericId },
  });
};
