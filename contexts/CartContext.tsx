'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, ProductVariant } from '@/types';

// Helper to generate unique cart item key
function getCartItemKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}-${variantId}` : productId;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('modoo_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('modoo_cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, quantity: number = 1, variant?: ProductVariant) => {
    setItems(prevItems => {
      const itemKey = getCartItemKey(product.id, variant?.id);
      const existingItem = prevItems.find(item =>
        getCartItemKey(item.product.id, item.variant?.id) === itemKey
      );
      if (existingItem) {
        return prevItems.map(item =>
          getCartItemKey(item.product.id, item.variant?.id) === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity, variant }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    const itemKey = getCartItemKey(productId, variantId);
    setItems(prevItems => prevItems.filter(item =>
      getCartItemKey(item.product.id, item.variant?.id) !== itemKey
    ));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }
    const itemKey = getCartItemKey(productId, variantId);
    setItems(prevItems =>
      prevItems.map(item =>
        getCartItemKey(item.product.id, item.variant?.id) === itemKey
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
