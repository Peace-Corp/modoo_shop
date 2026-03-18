'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrandCartProvider } from '@/contexts/BrandCartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BrandCartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </BrandCartProvider>
    </AuthProvider>
  );
}
