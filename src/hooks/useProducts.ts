import { useState, useEffect } from 'react';
import { mockProducts } from '@/data/mockData';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  base_price: number;
  category: string;
  is_active: boolean;
  type: 'customizable' | 'ready-made';
  allowed_options?: {
    flavors?: string[];
    fillings?: string[];
    sizes?: string[];
    themes?: string[];
    colors?: string[];
    layers?: string[];
  };
  default_options?: {
    flavor?: string;
    filling?: string;
    covering?: string;
    decoration?: string;
  };
}

// Converter formato do mockData para o formato esperado
const convertMockProducts = (): Product[] => {
  return mockProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    base_price: product.basePrice,
    category: product.category,
    is_active: product.isActive,
    type: product.type,
    allowed_options: product.allowedOptions,
    default_options: product.defaultOptions,
  }));
};

export const useProducts = (activeOnly = true) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [activeOnly]);

  const fetchProducts = async () => {
    // Simular delay de carregamento
    setLoading(true);
    
    setTimeout(() => {
      const allProducts = convertMockProducts();
      const filteredProducts = activeOnly 
        ? allProducts.filter(p => p.is_active) 
        : allProducts;
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 300);
  };

  return { products, loading, refetch: fetchProducts };
};
