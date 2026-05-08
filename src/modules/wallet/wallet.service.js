import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';

const mockPaymentProvider = ({ cardNumber, cvv, expiryDate, amount }) => {
  if (!cardNumber || !cvv || !expiryDate) {
    throw new AppError('Invalid mock payment data', 400);
  }

  if (Number(amount) <= 0) {
    throw new AppError('Amount must be greater than 0', 400);
  }

  return true;
};

export const deposit = async (userId, { amount, cardNumber, cvv, expiryDate }) => {
  mockPaymentProvider({ cardNumber, cvv, expiryDate, amount });

  return await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        balance: true,
      },
    });

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      balance: updatedUser.balance,
    };
  });
};

export const withdraw = async (userId, { amount }) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.balance < amount) {
      throw new AppError('Insufficient balance', 400);
    }

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        balance: true,
      },
    });

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      balance: updatedUser.balance,
    };
  });
};
