'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GradientButton } from '@/components/ui/gradient-button';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function RequestVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  const handleResendVerification = async () => {
    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while sending the verification email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-2xl relative overflow-hidden">
        <GlowingEffect className="absolute inset-0" />
        
        <div className="relative z-10">
          <div className="text-center">
            <Image
              src="/logo-light.svg"
              alt="ChargeX Logo"
              width={200}
              height={60}
              className="mx-auto"
            />
            <h2 className="mt-6 text-3xl font-bold text-white">
              Verify Your Email
            </h2>
            <p className="mt-2 text-gray-400">
              Please verify your email address to access your account
            </p>
          </div>

          <div className="mt-8">
            <div className="text-left mb-6">
              <p className="text-gray-300">
                We've sent a verification link to:
                <br />
                <span className="font-medium text-orange-500">{email}</span>
              </p>
            </div>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/20 border border-green-500/20 rounded-lg p-4 mb-6"
              >
                <p className="text-green-400">{message}</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-6"
              >
                <p className="text-red-400">{message}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              <GradientButton
                onClick={handleResendVerification}
                className="w-full"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <motion.div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Sending...
                  </motion.div>
                ) : (
                  'Resend Verification Email'
                )}
              </GradientButton>

              <button
                onClick={() => router.push('/login')}
                className="w-full text-gray-400 hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
