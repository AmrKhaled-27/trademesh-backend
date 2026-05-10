import { prisma } from '../../utils/prisma.js';

/**
 * Core function to create a transaction record.
 *
 * @param {Object} params - The transaction details.
 * @param {('deposit'|'withdraw'|'selling_operation')} params.type - The type of transaction (Required).
 * @param {number} params.amount - The monetary value (Required).
 * @param {number|null} [params.senderId] - ID of the user sending money.
 *                                          Null for deposits. Required for withdraw/selling (Optional).
 * @param {number|null} [params.receiverId] - ID of the user receiving money.
 *                                            Null for withdraws. Required for deposit/selling (Optional).
 * @param {number|null} [params.productId] - ID of the associated product.
 *                                           Only used for selling_operation (Optional).
 * @param {Object} [db=prisma] - Optional Prisma client/transaction instance.
 * @returns {Promise<Object>} The created transaction record.
 */
export const createTransaction = async (
  { type, amount, senderId, receiverId, productId },
  db = prisma,
) => {
  return db.transaction.create({
    data: {
      type,
      amount,
      senderId,
      receiverId,
      productId,
    },
  });
};

/**
 * Get all transactions for a specific user (either as sender or receiver)
 * sorted by createdAt in descending order.
 */
export const getUserTransactions = async (userId) => {
  return prisma.transaction.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sender: {
        select: { id: true, name: true, email: true },
      },
      receiver: {
        select: { id: true, name: true, email: true },
      },
      product: {
        select: { id: true, name: true },
      },
    },
  });
};
