import { createApiKey, listApiKeys, revokeApiKey } from './apiKey.service.js';

export const handleCreateApiKey = async (data) => {
  const result = await createApiKey(data.body, data.user.id);

  return {
    statusCode: 201,
    body: {
      message: 'API key created successfully',
      ...result,
    },
  };
};

export const handleListApiKeys = async (data) => {
  const result = await listApiKeys(data.user.id);

  return {
    statusCode: 200,
    body: {
      apiKeys: result,
    },
  };
};

export const handleRevokeApiKey = async (data) => {
  const result = await revokeApiKey(data.params.id, data.user.id);

  return {
    statusCode: 200,
    body: {
      message: 'API key revoked successfully',
      ...result,
    },
  };
};
