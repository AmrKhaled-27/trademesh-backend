import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT must be a valid number').default('3000'),
  TCP_PORT: z.string().regex(/^\d+$/, 'TCP_PORT must be a valid number').default('5000'),
  TCP_HOST: z.string().min(1, 'TCP_HOST is required').default('127.0.0.1'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters long'),

  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.string().regex(/^\d+$/, 'SMTP_PORT must be a valid port number'),
  SMTP_SECURE: z.enum(['true', 'false']).default('false'),
  SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
  MAIL_FROM: z.string().min(1, 'MAIL_FROM is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Environment variable validation failed:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

// Export the validated variables so they can be safely used across the app
export const env = parsedEnv.data;
