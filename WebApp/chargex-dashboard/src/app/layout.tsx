import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { NotificationProvider } from '@/contexts/notification-context';
import { Web3Provider } from '@/context/Web3Context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChargeX Dashboard',
  description: 'Manage your battery leasing and energy trading',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <Web3Provider>
              {children}
            </Web3Provider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
