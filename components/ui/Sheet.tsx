'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'bottom' | 'right';
}

export function Sheet({ open, onClose, children, side = 'bottom' }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const slideClasses = side === 'bottom'
    ? 'inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl animate-slide-up'
    : 'right-0 top-0 bottom-0 w-full max-w-md animate-slide-left';

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet Content */}
      <div className={`fixed z-50 bg-white shadow-xl flex flex-col ${slideClasses}`}>
        {children}
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slide-left {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-slide-left {
          animation: slide-left 0.3s ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
}

interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
}

export function SheetHeader({ children, className = '' }: SheetHeaderProps) {
  return (
    <div className={`px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 ${className}`}>
      {children}
    </div>
  );
}

interface SheetTitleProps {
  children: ReactNode;
  className?: string;
}

export function SheetTitle({ children, className = '' }: SheetTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

interface SheetBodyProps {
  children: ReactNode;
  className?: string;
}

export function SheetBody({ children, className = '' }: SheetBodyProps) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}

interface SheetFooterProps {
  children: ReactNode;
  className?: string;
}

export function SheetFooter({ children, className = '' }: SheetFooterProps) {
  return (
    <div className={`px-4 py-4 border-t border-gray-200 shrink-0 bg-white ${className}`}>
      {children}
    </div>
  );
}

interface SheetCloseButtonProps {
  onClose: () => void;
}

export function SheetCloseButton({ onClose }: SheetCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      aria-label="Close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
