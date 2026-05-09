import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const checkout = async ({ buyerId, productId }) => {

  console.log(`[CHECKOUT] Buyer ${buyerId} attempting to buy product ${productId}`);

  // Find product
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  // Product not found
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Prevent self purchase
  if (product.ownerId === buyerId) {
    throw new AppError('You cannot buy your own product', 400);
  }

  // Already locked
  if (product.isLocked) {
    throw new AppError('Product is currently locked', 409);
  }

  // Out of stock
  if (product.stock <= 0) {
    throw new AppError('Product out of stock', 400);
  }

  // Find buyer
  const buyer = await prisma.user.findUnique({
    where: { id: buyerId },
  });

  if (!buyer) {
    throw new AppError('Buyer not found', 404);
  }

  // Insufficient balance
  if (buyer.balance < product.price) {
    throw new AppError('INSUFFICIENT_BALANCE', 400);
  }

  // Atomic transaction
  const result = await prisma.$transaction(async (tx) => {

    // Lock product
    await tx.product.update({
      where: { id: productId },
      data: {
        isLocked: true,
      },
    });

    // Deduct money from buyer
    await tx.user.update({
      where: { id: buyerId },
      data: {
        balance: {
          decrement: product.price,
        },
      },
    });

    // Add money to seller
    await tx.user.update({
      where: { id: product.ownerId },
      data: {
        balance: {
          increment: product.price,
        },
      },
    });

    // Transfer ownership
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        ownerId: buyerId,
        stock: {
          decrement: 1,
        },
        isLocked: false,
      },
    });

    // Create transaction log
    const transaction = await tx.transaction.create({
      data: {
        buyerId,
        productId,
        amount: product.price,
        status: 'SUCCESS',
      },
    });

    return {
      transaction,
      product: updatedProduct,
    };
  });

  console.log(`[CHECKOUT SUCCESS] Transaction ${result.transaction.id}`);

  return result;
};

export const getTransactionById = async (transactionId) => {

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      product: true,
    },
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  return transaction;
};

export const getUserTransactions = async (userId) => {

  return prisma.transaction.findMany({
    where: {
      buyerId: userId,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};