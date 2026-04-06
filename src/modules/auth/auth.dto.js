import { z } from 'zod';

export const signupDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginDto = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyOtpDto = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});
