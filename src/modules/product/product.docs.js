export const productPaths = {
  '/api/products': {
    post: {
      tags: ['Products'],
      summary: 'Create a new product',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'price', 'stock'],
              properties: {
                name: { type: 'string', example: 'Wireless Keyboard' },
                description: { type: 'string', example: 'Compact wireless keyboard with backlight' },
                imageUrl: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://cdn.example.com/products/keyboard.jpg',
                },
                price: { type: 'number', example: 49.99 },
                stock: { type: 'integer', example: 35 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Product created successfully' },
        401: { description: 'Unauthorized' },
      },
    },
    get: {
      tags: ['Products'],
      summary: 'List active products',
      parameters: [
        { name: 'search', in: 'query', required: false, schema: { type: 'string', minLength: 1 } },
        { name: 'minPrice', in: 'query', required: false, schema: { type: 'number' } },
        { name: 'maxPrice', in: 'query', required: false, schema: { type: 'number' } },
        { name: 'inStock', in: 'query', required: false, schema: { type: 'boolean' } },
        { name: 'page', in: 'query', required: false, schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 10 } },
      ],
      responses: {
        200: { description: 'Products retrieved successfully' },
      },
    },
  },
  '/api/products/{id}': {
    get: {
      tags: ['Products'],
      summary: 'Get product by id',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Product retrieved successfully' },
        404: { description: 'Product not found' },
      },
    },
    patch: {
      tags: ['Products'],
      summary: 'Update a product',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Mechanical Keyboard' },
                description: { type: 'string', example: 'Updated product description' },
                imageUrl: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://cdn.example.com/products/keyboard-v2.jpg',
                },
                price: { type: 'number', example: 59.99 },
                stock: { type: 'integer', example: 20 },
                isActive: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Product updated successfully' },
        401: { description: 'Unauthorized' },
        404: { description: 'Product not found' },
      },
    },
    delete: {
      tags: ['Products'],
      summary: 'Delete (deactivate) a product',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Product deleted successfully' },
        401: { description: 'Unauthorized' },
        404: { description: 'Product not found' },
      },
    },
  },
};
