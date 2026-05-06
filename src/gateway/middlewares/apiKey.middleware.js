import { prisma } from '../../utils/prisma.js';
import crypto from 'crypto';

const hashApiKey = (key) => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

export const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required',
      });
    }

    const hashedKey = hashApiKey(apiKey);
    const keyRecord = await prisma.apiKey.findFirst({
      where: {
        key: hashedKey,
        isActive: true,
      },
    });

    if (!keyRecord) {
      return res.status(403).json({
        success: false,
        message: 'Invalid API key',
      });
    }

    req.apiKey = keyRecord;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
