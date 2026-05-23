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
              required: ['name', 'price', 'brand'],
              properties: {
                name: { type: 'string', example: 'Wireless Keyboard' },
                description: {
                  type: 'string',
                  example: 'Compact wireless keyboard with backlight',
                },
                mainImage: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://cdn.example.com/products/keyboard.jpg',
                },
                images: {
                  type: 'array',
                  items: { type: 'string', format: 'uri' },
                  example: ['https://cdn.example.com/products/kb1.jpg'],
                },
                brand: { type: 'string', example: 'Logitech' },
                price: { type: 'number', example: 49.99 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Product created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Product created successfully' },
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'Wireless Keyboard' },
                      description: {
                        type: 'string',
                        example: 'Compact wireless keyboard with backlight',
                      },
                      mainImage: {
                        type: 'string',
                        format: 'uri',
                        example: 'https://cdn.example.com/products/keyboard.jpg',
                      },
                      images: {
                        type: 'array',
                        items: { type: 'string', format: 'uri' },
                        example: [],
                      },
                      brand: { type: 'string', example: 'Logitech' },
                      price: { type: 'number', example: 49.99 },
                      status: { type: 'string', example: 'for_sale' },
                      ownerId: { type: 'integer', example: 10 },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
    get: {
      tags: ['Products'],
      summary: 'List active products (for sale)',
      parameters: [
        { name: 'search', in: 'query', required: false, schema: { type: 'string', minLength: 1 } },
        { name: 'brand', in: 'query', required: false, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          description: 'Products retrieved successfully (teaser info)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Wireless Keyboard' },
                        description: { type: 'string', example: 'Compact wireless keyboard' },
                        mainImage: {
                          type: 'string',
                          example: 'https://cdn.example.com/products/keyboard.jpg',
                        },
                        price: { type: 'number', example: 49.99 },
                        brand: { type: 'string', example: 'Logitech' },
                        status: { type: 'string', example: 'for_sale' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/products/bulk': {
    post: {
      tags: ['Products'],
      summary: 'Bulk create products from CSV',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'CSV file containing product data',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Products created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Products created successfully' },
                  count: { type: 'integer', example: 5 },
                },
              },
            },
          },
        },
        400: { description: 'Invalid CSV or file missing' },
        401: { description: 'Unauthorized' },
      },
    },
  },
  '/api/products/me': {
    get: {
      tags: ['Products'],
      summary: 'Get current user products (bought, sold, for sale)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Wireless Keyboard' },
                        description: { type: 'string' },
                        mainImage: { type: 'string' },
                        images: { type: 'array', items: { type: 'string' } },
                        brand: { type: 'string' },
                        price: { type: 'number' },
                        status: { type: 'string', example: 'sold' },
                        ownerId: { type: 'integer' },
                        buyerId: { type: 'integer', example: 10 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
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
        200: {
          description: 'Product retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      mainImage: { type: 'string' },
                      images: { type: 'array', items: { type: 'string' } },
                      brand: { type: 'string' },
                      price: { type: 'number' },
                      status: { type: 'string' },
                      ownerId: { type: 'integer' },
                      buyerId: { type: 'integer', nullable: true },
                    },
                  },
                },
              },
            },
          },
        },
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
                mainImage: {
                  type: 'string',
                  format: 'uri',
                  example: 'https://cdn.example.com/products/keyboard-v2.jpg',
                },
                images: {
                  type: 'array',
                  items: { type: 'string', format: 'uri' },
                },
                brand: { type: 'string', example: 'Logitech' },
                price: { type: 'number', example: 59.99 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Product updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Product updated successfully' },
                  product: { type: 'object' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        404: { description: 'Product not found' },
      },
    },
    delete: {
      tags: ['Products'],
      summary: 'Delete a product',
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
        200: {
          description: 'Product deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Product deleted successfully' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        404: { description: 'Product not found' },
      },
    },
  },
};
