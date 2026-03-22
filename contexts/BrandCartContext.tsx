'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, ProductVariant, BrandCartItem, BrandDeliveryOptions } from '@/types';
import { getStorageKey } from '@/lib/utils';

interface BrandCartContextType {
  brandId: string | null;
  brandName: string | null;
  items: BrandCartItem[];
  products: Product[];
  isOpen: boolean;
  openCart: (brandId: string, brandName: string, products: Product[]) => void;
  closeCart: () => void;
  setQuantity: (productId: string, variantId: string, product: Product, variant: ProductVariant, quantity: number) => void;
  getQuantity: (productId: string, variantId: string) => number;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getSelectedItems: () => BrandCartItem[];
}

const BrandCartContext = createContext<BrandCartContextType | undefined>(undefined);

export function BrandCartProvider({ children }: { children: ReactNode }) {
  const [brandId, setBrandId] = useState<string | null>(null);
  const [brandName, setBrandName] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<BrandCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration check
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load cart from sessionStorage when brand changes
  useEffect(() => {
    if (!isHydrated || !brandId) return;

    const savedCart = sessionStorage.getItem(getStorageKey(brandId));
    if (savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart) as BrandCartItem[];
        setItems(parsedItems);
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [brandId, isHydrated]);

  // Save cart to sessionStorage when items change
  useEffect(() => {
    if (!isHydrated || !brandId) return;
    sessionStorage.setItem(getStorageKey(brandId), JSON.stringify(items));
  }, [items, brandId, isHydrated]);

  const openCart = useCallback((newBrandId: string, newBrandName: string, newProducts: Product[]) => {
    setBrandId(newBrandId);
    setBrandName(newBrandName);
    setProducts(newProducts);
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setQuantity = useCallback((
    productId: string,
    variantId: string,
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => {
    setItems(prevItems => {
      // Remove item if quantity is 0 or less
      if (quantity <= 0) {
        return prevItems.filter(item =>
          !(item.product.id === productId && item.variant.id === variantId)
        );
      }

      // Check stock limit
      const finalQuantity = Math.min(quantity, variant.stock);

      // Find existing item
      const existingIndex = prevItems.findIndex(item =>
        item.product.id === productId && item.variant.id === variantId
      );

      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...prevItems];
        newItems[existingIndex] = { product, variant, quantity: finalQuantity };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { product, variant, quantity: finalQuantity }];
      }
    });
  }, []);

  const getQuantity = useCallback((productId: string, variantId: string): number => {
    const item = items.find(item =>
      item.product.id === productId && item.variant.id === variantId
    );
    return item?.quantity ?? 0;
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (brandId) {
      sessionStorage.removeItem(getStorageKey(brandId));
    }
  }, [brandId]);

  const getTotal = useCallback((): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback((): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const getSelectedItems = useCallback((): BrandCartItem[] => {
    return items.filter(item => item.quantity > 0);
  }, [items]);

  return (
    <BrandCartContext.Provider
      value={{
        brandId,
        brandName,
        items,
        products,
        isOpen,
        openCart,
        closeCart,
        setQuantity,
        getQuantity,
        clearCart,
        getTotal,
        getItemCount,
        getSelectedItems,
      }}
    >
      {children}
    </BrandCartContext.Provider>
  );
}

export function useBrandCart() {
  const context = useContext(BrandCartContext);
  if (context === undefined) {
    throw new Error('useBrandCart must be used within a BrandCartProvider');
  }
  return context;
}

// Helper function to load brand cart from sessionStorage (for checkout page)
export function loadBrandCartFromSession(brandId: string): BrandCartItem[] {
  if (typeof window === 'undefined') return [];

  const savedCart = sessionStorage.getItem(getStorageKey(brandId));
  if (savedCart) {
    try {
      return JSON.parse(savedCart) as BrandCartItem[];
    } catch {
      return [];
    }
  }
  return [];
}

// Helper function to clear brand cart from sessionStorage (for checkout success)
export function clearBrandCartFromSession(brandId: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(getStorageKey(brandId));
  sessionStorage.removeItem(`modoo_brand_delivery_${brandId}`);
}

// Save brand delivery options to sessionStorage
export function saveBrandDeliveryOptions(brandId: string, options: BrandDeliveryOptions): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`modoo_brand_delivery_${brandId}`, JSON.stringify(options));
}

// Load brand delivery options from sessionStorage
export function loadBrandDeliveryOptions(brandId: string): BrandDeliveryOptions | null {
  if (typeof window === 'undefined') return null;
  const saved = sessionStorage.getItem(`modoo_brand_delivery_${brandId}`);
  if (saved) {
    try { return JSON.parse(saved) as BrandDeliveryOptions; } catch { return null; }
  }
  return null;
}
