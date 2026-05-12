import { authPaths } from '../../modules/auth/auth.docs.js';
import { userPaths } from '../../modules/user/user.docs.js';
import { apiKeyPaths } from '../../modules/api-key/apiKey.docs.js';
import { productPaths } from '../../modules/product/product.docs.js';

// Wallet Swagger docs added by the wallet feature owner.
import { walletPaths } from '../../modules/wallet/wallet.docs.js';
import { checkoutDocs } from '../../modules/checkout/checkout.docs.js';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Trademesh Marketplace API',
    version: '1.0.0',
    description: 'API Documentation for the Trademesh Marketplace backend.',
  },
  security: [],
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
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
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
    { name: 'API Keys', description: 'API key management for external store integrations' },
    { name: 'Products', description: 'Product catalog management' },
    { name: 'Checkout', description: 'Checkout and product purchasing' },

    // Wallet tag added by the wallet feature owner.
    { name: 'Wallet', description: 'Wallet balance operations' },
  ],
  paths: {
    ...authPaths,
    ...userPaths,
    ...apiKeyPaths,
    ...productPaths,

    // Wallet paths added by the wallet feature owner.
    ...walletPaths,
    ...checkoutDocs,
  },
};
