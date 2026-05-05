import crypto from 'crypto';
import { prisma } from '../../utils/prisma.js';
import { AppError } from '../../utils/AppError.js';

const hashApiKey = (key) => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

export const createApiKey = async ({ name }, userId) => {
  const key = `tm_${crypto.randomBytes(32).toString('hex')}`;
  const hashedKey = hashApiKey(key);

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      key: hashedKey,
      isActive: true,
      userId,
    },
  });

  return {
    ...apiKey,
    key, //
  };
};

export const listApiKeys = async (userId) => {
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return apiKeys.map(({ key, ...apiKey }) => apiKey);
};

export const revokeApiKey = async (id, userId) => {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!apiKey) {
    throw new AppError('API key not found', 404);
  }

  const updatedApiKey = await prisma.apiKey.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  const { key, ...safeApiKey } = updatedApiKey;

  return safeApiKey;
};
