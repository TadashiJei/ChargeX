'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { GlowingGrid } from '@/components/ui/glowing-grid';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <div className="lg:pl-64 relative">
        <GlowingGrid className="fixed top-0 right-0 bottom-0 left-64" />
        <div className="relative">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
