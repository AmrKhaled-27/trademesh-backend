import * as checkoutService from './checkout.service.js';

export const handleCheckout = async (data) => {
  const result = await checkoutService.checkoutProduct(data.user.id, data.body.productId);

  return {
    statusCode: 201,
    body: {
      message: 'Checkout completed successfully',
      ...result,
    },
  };
};

export const handleGetMyCheckouts = async (data) => {
  const checkouts = await checkoutService.getMyCheckouts(data.user.id);

  return {
    statusCode: 200,
    body: {
      checkouts,
    },
  };
};

export const handleGetCheckoutById = async (data) => {
  const checkout = await checkoutService.getCheckoutById(data.params.id, data.user.id);

  return {
    statusCode: 200,
    body: {
      checkout,
    },
  };
};
