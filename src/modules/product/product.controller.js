import * as productService from './product.service.js';

export const handleCreateProduct = async (data) => {
  const product = await productService.createProduct(data.body, data.user.id);

  return {
    statusCode: 201,
    body: {
      message: 'Product created successfully',
      product,
    },
  };
};

export const handleBulkCreateProduct = async (data) => {
  const result = await productService.bulkCreateProducts(data.body.products, data.user.id);

  return {
    statusCode: 201,
    body: {
      message: 'Products created successfully',
      count: result.count,
    },
  };
};

export const handleListProducts = async (data) => {
  const products = await productService.listProducts(data.query);

  return {
    statusCode: 200,
    body: {
      products,
    },
  };
};

export const handleGetProductById = async (data) => {
  const product = await productService.findProductById(data.params.id);

  return {
    statusCode: 200,
    body: {
      product,
    },
  };
};

export const handleGetMyProducts = async (data) => {
  const products = await productService.getMyProducts(data.user.id);

  return {
    statusCode: 200,
    body: {
      products,
    },
  };
};

export const handleUpdateProduct = async (data) => {
  const product = await productService.updateProduct(data.params.id, data.body, data.user.id);

  return {
    statusCode: 200,
    body: {
      message: 'Product updated successfully',
      product,
    },
  };
};

export const handleDeleteProduct = async (data) => {
  await productService.deleteProduct(data.params.id, data.user.id);

  return {
    statusCode: 200,
    body: {
      message: 'Product deleted successfully',
    },
  };
};
