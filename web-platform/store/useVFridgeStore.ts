import { create } from 'zustand';
import { Product } from '@/interfaces/type';

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void; // Чітко вказуємо number
  updateProduct: (updated: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  
  setProducts: (products) => set({ products }),
  
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  
  removeProduct: (id: number) => set((state) => ({ 
    // Використовуємо суворе порівняння, тепер типи збігаються (number === number)
    products: state.products.filter((p) => p.id !== id) 
  })),
  
  updateProduct: (updated: Product) => set((state) => ({
    products: state.products.map((p) => (p.id === updated.id ? updated : p))
  })),
}));