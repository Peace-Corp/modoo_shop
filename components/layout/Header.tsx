'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function Header() {
  const { user, signOut, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const itemCount = getItemCount();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/modoo_logo.png" alt="" className='w-[90px]' />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              홈
            </Link>
            <Link href="/brands" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              브랜드
            </Link>
            <Link href="/search" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              검색
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              고객센터
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              주문조회
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Mobile) */}
            <Link href="/search" className="md:hidden p-2 text-gray-600 hover:text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Cart Button */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 shadow-lg">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-600 hover:text-indigo-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                홈
              </Link>
              <Link href="/brands" className="text-gray-600 hover:text-indigo-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                브랜드
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-indigo-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                검색
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                고객센터
              </Link>
              <Link href="/orders" className="text-gray-600 hover:text-indigo-600 px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                주문조회
              </Link>
              {/* {!user && (
                <Link href="/signin" className="text-indigo-600 font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                  로그인
                </Link>
              )} */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
