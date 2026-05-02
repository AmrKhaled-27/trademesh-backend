import { z } from 'zod';
import { AppError } from '../../utils/AppError.js';

/**
 * Creates an Express middleware that validates request payloads using Zod schemas.
 *
 * @param {Object} schemas - Schemas to validate.
 * @param {import('zod').ZodTypeAny} [schemas.body] - Zod schema for req.body.
 * @param {import('zod').ZodTypeAny} [schemas.params] - Zod schema for req.params.
 * @param {import('zod').ZodTypeAny} [schemas.query] - Zod schema for req.query.
 * @returns {import('express').RequestHandler} Express middleware.
 */
export const validate = ({ body, params, query } = {}) => {
  return (req, res, next) => {
    try {
      if (body) {
        req.validatedBody = body.parse(req.body);
      }

      if (params) {
        req.validatedParams = params.parse(req.params);
      }

      if (query) {
        req.validatedQuery = query.parse(req.query);
      }

      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map over the issues array to build a structured object map
        const ObjectErrors = error.issues.reduce((acc, issue) => {
          const field = issue.path.join('.') || 'payload';
          acc[field] = issue.message;
          return acc;
        }, {});

        return next(new AppError('Validation failed.', 400, ObjectErrors));
      }

      return next(new AppError('Invalid request payload.', 400));
    }
  };
};
