import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { deposit, withdraw } from '../wallet/wallet.service.js';
import { findProductById, markProductAsSold } from '../product/product.service.js';

const checkoutInclude = {
  buyer: {
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
    },
  },
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
    },
  },
  product: true,
};

const toPositiveInteger = (value, fieldName) => {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    throw new AppError(`${fieldName} must be a positive integer`, 400);
  }

  return numericValue;
};

export const checkoutProduct = async (buyerId, productId) => {
  const numericBuyerId = toPositiveInteger(buyerId, 'Buyer id');
  const numericProductId = toPositiveInteger(productId, 'Product id');

  return prisma.$transaction(async (transactionClient) => {
    const product = await findProductById(numericProductId, transactionClient);

    if (product.ownerId === numericBuyerId) {
      throw new AppError('You cannot checkout your own product', 400);
    }

    if (product.status !== 'for_sale' || product.buyerId) {
      throw new AppError('Product is not available for checkout', 409);
    }

    const updatedProduct = await markProductAsSold(
      numericProductId,
      numericBuyerId,
      transactionClient,
    );

    const buyerWallet = await withdraw(
      numericBuyerId,
      { amount: product.price },
      transactionClient,
    );

    const sellerWallet = await deposit(
      product.ownerId,
      { amount: product.price },
      transactionClient,
    );

    const checkout = await transactionClient.checkout.create({
      data: {
        productId: product.id,
        buyerId: numericBuyerId,
        sellerId: product.ownerId,
        amount: product.price,
        status: 'completed',
      },
      include: checkoutInclude,
    });

    return {
      checkout,
      product: updatedProduct,
      buyerWallet,
      sellerWallet,
    };
  });
};

export const getMyCheckouts = async (userId) => {
  const numericUserId = toPositiveInteger(userId, 'User id');

  return prisma.checkout.findMany({
    where: {
      OR: [{ buyerId: numericUserId }, { sellerId: numericUserId }],
    },
    include: checkoutInclude,
    orderBy: { createdAt: 'desc' },
  });
};

export const getCheckoutById = async (checkoutId, userId) => {
  const numericCheckoutId = toPositiveInteger(checkoutId, 'Checkout id');
  const numericUserId = toPositiveInteger(userId, 'User id');

  const checkout = await prisma.checkout.findFirst({
    where: {
      id: numericCheckoutId,
      OR: [{ buyerId: numericUserId }, { sellerId: numericUserId }],
    },
    include: checkoutInclude,
  });

  if (!checkout) {
    throw new AppError('Checkout not found', 404);
  }

  return checkout;
};
