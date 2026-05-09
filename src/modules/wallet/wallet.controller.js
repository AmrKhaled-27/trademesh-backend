import { deposit, withdraw } from './wallet.service.js';

export const handleDeposit = async (data) => {
  const result = await deposit(data.user.id, data.body);

  return {
    statusCode: 200,
    body: {
      message: 'Deposit successful',
      ...result,
    },
  };
};

export const handleWithdraw = async (data) => {
  const result = await withdraw(data.user.id, data.body);

  return {
    statusCode: 200,
    body: {
      message: 'Withdraw successful',
      ...result,
    },
  };
};
