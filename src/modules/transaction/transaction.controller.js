import * as transactionService from './transaction.service.js';

export const checkout = async (data) => {
  const buyerId = data.user.id;
  const { productId } = data.body;

  const result = await transactionService.checkout({
    buyerId,
    productId,
  });

  return {
    statusCode: 200,
    body: {
      message: 'Checkout completed successfully',
      transaction: result,
    },
  };
};

export const getTransactionById = async (data) => {
  const transactionId = Number(data.params.id);

  const transaction = await transactionService.getTransactionById(transactionId);

  return {
    statusCode: 200,
    body: {
      transaction,
    },
  };
};

export const getUserTransactions = async (data) => {
  const userId = Number(data.params.userId);

  const transactions = await transactionService.getUserTransactions(userId);

  return {
    statusCode: 200,
    body: {
      transactions,
    },
  };
};