import { RateLimiterMemory } from 'rate-limiter-flexible';
import UAParser from 'ua-parser-js';
import CryptoJS from 'crypto-js';
import { NextRequest } from 'next/server';

// Rate limiter for login attempts
export const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 15, // per 15 minutes
  blockDuration: 60 * 60, // 1 hour block
});

// Rate limiter for registration
export const registrationLimiter = new RateLimiterMemory({
  points: 3, // 3 attempts
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60 * 24, // 24 hour block
});

// Rate limiter for password reset
export const passwordResetLimiter = new RateLimiterMemory({
  points: 3, // 3 attempts
  duration: 60 * 60 * 24, // per day
  blockDuration: 60 * 60 * 24, // 24 hour block
});

// Function to get device info
export const getDeviceInfo = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  return {
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    device: result.device.type || (result.device.vendor ? `${result.device.vendor} ${result.device.model}` : 'Desktop'),
  };
};

// Function to get approximate location from IP
export const getLocationFromIP = async (ip: string): Promise<string> => {
  try {
    // Remove for production - just for testing
    if (ip === 'localhost' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return 'Local Network';
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'Location lookup failed');
    }

    return `${data.city || ''}, ${data.country_name || 'Unknown Location'}`.trim();
  } catch (error) {
    console.error('Error getting location:', error);
    return 'Unknown Location';
  }
};

// Function to encrypt sensitive data
export const encryptData = (data: string, key: string = process.env.ENCRYPTION_KEY || ''): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

// Function to decrypt sensitive data
export const decryptData = (encryptedData: string, key: string = process.env.ENCRYPTION_KEY || ''): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Function to generate a secure session ID
export const generateSessionId = (): string => {
  return CryptoJS.SHA256(Date.now().toString() + Math.random().toString()).toString();
};

// Function to extract client IP from request
export const getClientIP = (request: NextRequest): string => {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         request.ip || 
         'Unknown';
};

// Security headers for responses
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data: https:; " +
    "connect-src 'self' https:;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};
