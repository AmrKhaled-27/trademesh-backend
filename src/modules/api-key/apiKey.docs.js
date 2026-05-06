export const apiKeyPaths = {
  '/api/api-keys': {
    post: {
      tags: ['API Keys'],
      summary: 'Create a new API key',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  type: 'string',
                  example: 'My Store Key',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'API key created successfully',
        },
      },
      security: [{ bearerAuth: [] }],
    },
    get: {
      tags: ['API Keys'],
      summary: 'List API keys',
      responses: {
        200: {
          description: 'API keys retrieved successfully',
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },

  '/api/api-keys/{id}': {
    delete: {
      tags: ['API Keys'],
      summary: 'Revoke an API key',
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
          description: 'API key revoked successfully',
        },
        404: {
          description: 'API key not found',
        },
      },
      security: [{ bearerAuth: [] }],
    },
  },
};
