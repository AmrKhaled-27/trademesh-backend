export const walletPaths = {
  '/api/wallet/deposit': {
    post: {
      tags: ['Wallet'],
      summary: 'Deposit funds into the authenticated user wallet',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount', 'cardNumber', 'cvv', 'expiryDate'],
              properties: {
                amount: {
                  type: 'number',
                  example: 100,
                },
                cardNumber: {
                  type: 'string',
                  example: '4111111111111111',
                },
                cvv: {
                  type: 'string',
                  example: '123',
                },
                expiryDate: {
                  type: 'string',
                  example: '12/27',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Deposit successful',
        },
        400: {
          description: 'Invalid amount or invalid mock payment data',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },

  '/api/wallet/withdraw': {
    post: {
      tags: ['Wallet'],
      summary: 'Withdraw funds from the authenticated user wallet',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount'],
              properties: {
                amount: {
                  type: 'number',
                  example: 50,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Withdraw successful',
        },
        400: {
          description: 'Invalid amount or insufficient balance',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
};
