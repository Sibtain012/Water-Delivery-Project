import { create } from 'zustand';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: initialProducts,
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, product]
  })),
  
  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map(p => 
      p.id === id ? { ...p, ...updatedProduct } : p
    )
  })),
  
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  
  getProduct: (id) => {
    return get().products.find(p => p.id === id);
  }
}));
