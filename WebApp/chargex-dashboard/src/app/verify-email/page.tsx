'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GradientButton } from '@/components/ui/gradient-button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Email Verification
          </h2>
          
          <div className="mt-8">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <p className="text-gray-300">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="text-green-400 text-6xl mb-4">✓</div>
                <p className="text-gray-300">{message}</p>
                <div className="mt-6">
                  <GradientButton
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Continue to Login
                  </GradientButton>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="text-red-400 text-6xl mb-4">✕</div>
                <p className="text-red-400">{message}</p>
                <div className="mt-6 space-y-4">
                  <GradientButton
                    onClick={() => router.push('/register')}
                    className="w-full"
                  >
                    Back to Registration
                  </GradientButton>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full text-gray-400 hover:text-white transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
