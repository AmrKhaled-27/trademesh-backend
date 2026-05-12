import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { createTransaction } from '../transaction/transaction.service.js';

const runWithTransaction = async (transactionClient, callback) => {
  if (transactionClient) {
    return callback(transactionClient);
  }

  return prisma.$transaction(callback);
};

export const incrementBalance = async (userId, amount, db = prisma) => {
  return db.user.update({
    where: { id: userId },
    data: { balance: { increment: amount } },
    select: { id: true, email: true, name: true, balance: true },
  });
};

export const decrementBalance = async (userId, amount, db = prisma) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.balance < amount) {
    throw new AppError('Insufficient balance', 400);
  }

  return db.user.update({
    where: { id: userId },
    data: { balance: { decrement: amount } },
    select: { id: true, email: true, name: true, balance: true },
  });
};

export const deposit = async (userId, { amount }, transactionClient = null) => {
  return runWithTransaction(transactionClient, async (db) => {
    const updatedUser = await incrementBalance(userId, amount, db);

    await createTransaction(
      {
        type: 'deposit',
        amount,
        receiverId: userId,
      },
      db,
    );

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
    const updatedUser = await decrementBalance(userId, amount, db);

    await createTransaction(
      {
        type: 'withdraw',
        amount,
        senderId: userId,
      },
      db,
    );

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      balance: updatedUser.balance,
    };
  });
};
