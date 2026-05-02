import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

/**
 * Middleware to authenticate requests via JWT access token.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided or invalid format.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (decoded.isTemp) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Temporary tokens cannot access protected routes.',
      });
    }

    req.user = decoded; // Attach parsed payload to request object.
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token.',
    });
  }
};
