export const transactionPaths = {
  '/api/transactions/checkout': {
    post: {
      tags: ['Transactions'],
      summary: 'Checkout a product',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId'],
              properties: {
                productId: {
                  type: 'number',
                  example: 1,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Checkout completed successfully',
        },
        400: {
          description: 'Invalid request or insufficient balance',
        },
        404: {
          description: 'Product not found',
        },
      },
    },
  },

  '/api/transactions/{id}': {
    get: {
      tags: ['Transactions'],
      summary: 'Get transaction by id',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'number',
          },
        },
      ],
      responses: {
        200: {
          description: 'Transaction retrieved successfully',
        },
      },
    },
  },

  '/api/transactions/user/{userId}': {
    get: {
      tags: ['Transactions'],
      summary: 'Get user transactions',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'number',
          },
        },
      ],
      responses: {
        200: {
          description: 'Transactions retrieved successfully',
        },
      },
    },
  },
};