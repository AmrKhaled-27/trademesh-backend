/**
 * Wraps async functions to catch errors and pass them to Express's next() function.
 *
 * @param {Function} fn - The asynchronous middleware or controller function.
 * @returns {Function} Express middleware function.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
