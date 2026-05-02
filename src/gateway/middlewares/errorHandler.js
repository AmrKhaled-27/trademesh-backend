export const errorHandler = (err, req, res, next) => {
  // Log the error stack to the console (useful for debugging)
  console.error(`[Error] ${err.message}`);
  if (err.stack) console.error(err.stack);

  // Determine status code (default to 500 if not specified on the error object)
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';

  const response = {
    success: false,
    message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};
