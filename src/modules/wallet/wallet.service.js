import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';

const runWithTransaction = async (transactionClient, callback) => {
  if (transactionClient) {
    return callback(transactionClient);
  }

  return prisma.$transaction(callback);
};

export const deposit = async (userId, { amount }, transactionClient = null) => {
  return runWithTransaction(transactionClient, async (db) => {
    const updatedUser = await db.user.update({
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

export const withdraw = async (userId, { amount }, transactionClient = null) => {
  return runWithTransaction(transactionClient, async (db) => {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
      },
    });

    if (user.balance < amount) {
      throw new AppError('Insufficient balance', 400);
    }

    const updatedUser = await db.user.update({
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
