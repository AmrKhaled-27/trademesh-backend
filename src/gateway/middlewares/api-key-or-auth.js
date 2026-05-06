import { prisma } from '../../utils/prisma.js';
import crypto from 'crypto';
import { authenticate } from './authenticate.js';

const hashApiKey = (key) => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

/**
 * Middleware to verify access via either an API key or standard JWT authentication.
 * If an 'x-api-key' header is present, it validates the API key and fetches the associated user.
 * Otherwise, it falls back to the 'authenticate' middleware for JWT validation.
 */
export const apiKeyOrAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      // No API key provided, fall back to standard JWT authentication
      return authenticate(req, res, next);
    }

    const hashedKey = hashApiKey(apiKey);
    const keyRecord = await prisma.apiKey.findFirst({
      where: {
        key: hashedKey,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    if (!keyRecord || !keyRecord.user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or inactive API key',
      });
    }

    // Attach API key record for reference
    req.apiKey = keyRecord;

    // Attach user object (excluding sensitive fields) to req.user
    // This ensures consistency with the JWT authentication path
    const { password, otp, otpExpiresAt, ...safeUser } = keyRecord.user;
    req.user = safeUser;

    next();
  } catch (error) {
    console.error('Access Verification Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
