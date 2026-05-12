export const checkoutDocs = {
  '/checkout': {
    post: {
      tags: ['Checkout'],
      summary: 'Purchase a product',
      description:
        'Withdraws funds from buyer, deposits to seller, updates product status, and records transaction.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['productId', 'cardInfo'],
              properties: {
                productId: {
                  type: 'integer',
                  example: 1,
                },
                cardInfo: {
                  type: 'object',
                  required: ['cardNumber', 'cardHolder', 'cvv', 'expiryDate'],
                  properties: {
                    cardNumber: { type: 'string', example: '1234567812345678' },
                    cardHolder: { type: 'string', example: 'John Doe' },
                    cvv: { type: 'string', example: '123' },
                    expiryDate: { type: 'string', example: '12/26' },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Product purchased successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'success' },
                  data: {
                    type: 'object',
                    properties: {
                      product: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          status: { type: 'string', example: 'sold' },
                          buyerId: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Insufficient balance or product unavailable',
        },
        404: {
          description: 'Product not found',
        },
      },
    },
  },
};
