'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrandCartProvider } from '@/contexts/BrandCartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBrandPage = pathname.startsWith('/brands/');

  return (
    <AuthProvider>
      <BrandCartProvider>
        <div className="min-h-screen flex flex-col">
          {!isBrandPage && <Header />}
          <main className="flex-1">{children}</main>
          {!isBrandPage && <Footer />}
        </div>
      </BrandCartProvider>
    </AuthProvider>
  );
}
