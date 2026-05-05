import { z } from 'zod';

export const createApiKeyDto = z.object({
  name: z.string().min(2, 'API key name must be at least 2 characters'),
});

export const revokeApiKeyParamsDto = z.object({
  id: z.string().min(1, 'API key id is required'),
});
