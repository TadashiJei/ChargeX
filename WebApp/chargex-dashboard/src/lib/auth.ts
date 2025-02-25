import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { getRegistrationEmailTemplate, getLoginNotificationTemplate } from './email-templates';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error('SMTP configuration is incomplete in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@chargex.io';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateVerificationToken = (): string => {
  return randomBytes(32).toString('hex');
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465, // Using secure port 465 for SSL
  secure: true, // Use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"ChargeX" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ChargeX!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for registering with ChargeX. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #f97316; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with ChargeX, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email, please do not reply.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export const sendOTPEmail = async (
  email: string,
  firstName: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your ChargeX Security Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(45deg, #f78a1d, #f7621d); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-light.svg" alt="ChargeX Logo" style="width: 200px;" />
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #333; margin-bottom: 20px;">Hi ${firstName},</h1>
          <p>Here's your security code to complete the login:</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; font-family: monospace;">
            <h2 style="color: #f78a1d; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h2>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes for security purposes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please secure your account immediately.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p> ${new Date().getFullYear()} ChargeX. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

export const sendLoginNotification = async (
  email: string,
  firstName: string,
  location: string,
  device: string
): Promise<void> => {
  const time = new Date().toLocaleString('en-US', { 
    timeZone: 'UTC',
    timeZoneName: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'New Login to Your ChargeX Account',
    html: getLoginNotificationTemplate(firstName, location, device, time),
  });
};

export const validatePassword = (password: string): {
  score: number;
  feedback: string[];
} => {
  const zxcvbn = require('zxcvbn');
  const result = zxcvbn(password);

  const feedback = [];
  if (password.length < 8) feedback.push('Password must be at least 8 characters long');
  if (!/[A-Z]/.test(password)) feedback.push('Include at least one uppercase letter');
  if (!/[a-z]/.test(password)) feedback.push('Include at least one lowercase letter');
  if (!/[0-9]/.test(password)) feedback.push('Include at least one number');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Include at least one special character');

  return {
    score: result.score,
    feedback: feedback.length > 0 ? feedback : result.feedback.suggestions,
  };
};
