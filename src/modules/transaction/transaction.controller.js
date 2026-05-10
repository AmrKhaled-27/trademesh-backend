import * as transactionService from './transaction.service.js';

export const handleGetUserTransactions = async (data) => {
  const transactions = await transactionService.getUserTransactions(data.user.id);

  return {
    statusCode: 200,
    body: {
      success: true,
      transactions,
    },
  };
};
