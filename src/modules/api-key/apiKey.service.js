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

  const { key: _, isActive: __, ...safeApiKey } = apiKey;
  return {
    ...safeApiKey,
    key,
  };
};

export const listApiKeys = async (userId) => {
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return apiKeys.map(({ key, isActive, ...apiKey }) => apiKey);
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

  const { key, isActive, ...safeApiKey } = updatedApiKey;

  return safeApiKey;
};
