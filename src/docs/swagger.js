import { authPaths } from '../modules/auth/auth.docs.js';
import { userPaths } from '../modules/user/user.docs.js';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Trademesh Marketplace API',
    version: '1.0.0',
    description: 'API Documentation for the Trademesh Marketplace backend.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message description' },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed.' },
          errors: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication and 2FA' },
    { name: 'Users', description: 'User Profile and Management' },
  ],
  paths: {
    ...authPaths,
    ...userPaths,
  },
};
