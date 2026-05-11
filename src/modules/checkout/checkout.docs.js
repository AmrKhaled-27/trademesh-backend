export const checkoutPaths = {
  '/api/checkout': {
    post: {
      tags: ['Checkout'],
      summary: 'Checkout a product using the authenticated user wallet balance',
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
                  type: 'integer',
                  example: 1,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Checkout completed successfully',
        },
        400: {
          description: 'Invalid product id, self checkout, or insufficient balance',
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'Product not found',
        },
        409: {
          description: 'Product is not available for checkout',
        },
      },
    },
  },

  '/api/checkout/me': {
    get: {
      tags: ['Checkout'],
      summary: 'Get checkout history for the authenticated user as buyer or seller',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Checkout history retrieved successfully',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },

  '/api/checkout/{id}': {
    get: {
      tags: ['Checkout'],
      summary: 'Get a checkout by id if the authenticated user is the buyer or seller',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Checkout retrieved successfully',
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'Checkout not found',
        },
      },
    },
  },
};
