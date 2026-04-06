import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of PrismaClient.
 * @type {PrismaClient}
 */
export const prisma = new PrismaClient();
