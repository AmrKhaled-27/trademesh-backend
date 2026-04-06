import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

/**
 * Builds a Nodemailer SMTP transporter using environment variables.
 *
 * @returns {import('nodemailer').Transporter} Configured SMTP transporter instance.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === 'true',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

/**
 * Sends an OTP via email to the given recipient.
 *
 * @param {string} email - Recipient's email address.
 * @param {string} otp - The One-Time Password to send.
 * @returns {Promise<boolean>} True if the email was successfully sent.
 */
export const sendOTP = async (email, otp) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: 'Your Verification Code',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  });

  return true;
};
