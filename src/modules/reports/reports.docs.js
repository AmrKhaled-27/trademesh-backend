export const reportsPaths = {
  '/api/reports/financial-summary': {
    get: {
      tags: ['Reports'],
      summary: 'Get financial summary for the authenticated user',
      description:
        'Returns total revenue (from sales), total spent (on purchases), and current wallet balance.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Financial summary retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  summary: {
                    type: 'object',
                    properties: {
                      totalRevenue: { type: 'number', example: 1250.0 },
                      totalSpent: { type: 'number', example: 340.5 },
                      walletBalance: { type: 'number', example: 909.5 },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized – missing or invalid token' },
      },
    },
  },

  '/api/reports/sales-chart': {
    get: {
      tags: ['Reports'],
      summary: 'Get daily sales data for charting',
      description:
        'Returns revenue and expenses grouped by day for the last N days (default 30). Suitable for line/bar charts.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'days',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 365, default: 30 },
          description: 'Number of days to look back (1–365, defaults to 30)',
        },
      ],
      responses: {
        200: {
          description: 'Sales chart data retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  chartData: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        date: { type: 'string', format: 'date', example: '2026-05-10' },
                        revenue: { type: 'number', example: 150.0 },
                        expenses: { type: 'number', example: 45.0 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: 'Validation error – invalid days parameter' },
        401: { description: 'Unauthorized – missing or invalid token' },
      },
    },
  },

  '/api/reports/top-products': {
    get: {
      tags: ['Reports'],
      summary: 'Get top 5 most-sold products by the authenticated user',
      description:
        'Returns the 5 products owned by this user that have the highest number of completed sales.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Top products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  topProducts: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 12 },
                        name: { type: 'string', example: 'Wireless Keyboard' },
                        mainImage: {
                          type: 'string',
                          format: 'uri',
                          example: 'https://cdn.example.com/products/keyboard.jpg',
                        },
                        brand: { type: 'string', example: 'Logitech' },
                        price: { type: 'number', example: 49.99 },
                        salesCount: { type: 'integer', example: 8 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized – missing or invalid token' },
      },
    },
  },
};
