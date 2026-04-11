export const userPaths = {
  '/api/users/me': {
    get: {
      tags: ['Users'],
      summary: 'Get current user profile',
      description: 'Retrieve detailed information about the currently authenticated user.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'User profile retrieved successfully' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: '123' },
                          name: { type: 'string', example: 'John Doe' },
                          email: { type: 'string', example: 'john@example.com' },
                          balance: { type: 'number', example: 100.5 },
                          createdAt: { type: 'string', format: 'date-time' },
                          updatedAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized access',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                success: false,
                message: 'Unauthorized',
              },
            },
          },
        },
      },
    },
  },
};
