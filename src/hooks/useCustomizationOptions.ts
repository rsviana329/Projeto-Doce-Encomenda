import { useState, useEffect } from 'react';
import { 
  standardSizes, 
  standardFlavors, 
  standardFillings, 
  standardCoverings, 
  standardDecorations,
  layers 
} from '@/data/mockData';

export interface CustomizationOption {
  id: string;
  option_type: string;
  option_id: string;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
}

// Converter opções do mockData para o formato esperado
const convertMockOptions = (): CustomizationOption[] => {
  const allOptions: CustomizationOption[] = [];
  
  // Tamanhos
  standardSizes.forEach(opt => {
    allOptions.push({
      id: `size-${opt.id}`,
      option_type: 'size',
      option_id: opt.id,
      name: opt.name,
      price: opt.price,
      description: opt.description,
      is_active: true,
    });
  });
  
  // Sabores
  standardFlavors.forEach(opt => {
    allOptions.push({
      id: `flavor-${opt.id}`,
      option_type: 'flavor',
      option_id: opt.id,
      name: opt.name,
      price: opt.price,
      description: opt.description,
      is_active: true,
    });
  });
  
  // Recheios
  standardFillings.forEach(opt => {
    allOptions.push({
      id: `filling-${opt.id}`,
      option_type: 'filling',
      option_id: opt.id,
      name: opt.name,
      price: opt.price,
      description: opt.description,
      is_active: true,
    });
  });
  
  // Coberturas
  standardCoverings.forEach(opt => {
    allOptions.push({
      id: `covering-${opt.id}`,
      option_type: 'covering',
      option_id: opt.id,
      name: opt.name,
      price: opt.price,
      description: opt.description,
      is_active: true,
    });
  });
  
  // Decorações
  standardDecorations.forEach(opt => {
    allOptions.push({
      id: `decoration-${opt.id}`,
      option_type: 'decoration',
      option_id: opt.id,
      name: opt.name,
      price: opt.price,
      description: opt.description,
      is_active: true,
    });
  });
  
  // Andares
  layers.forEach(opt => {
    allOptions.push({
      id: `layer-${opt.id}`,
      option_type: 'layer',
      option_id: opt.id,
      name: opt.name,
      price: opt.price,
      description: opt.description,
      is_active: true,
    });
  });
  
  return allOptions;
};

export const useCustomizationOptions = (activeOnly = true) => {
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, [activeOnly]);

  const fetchOptions = async () => {
    // Simular delay de carregamento
    setLoading(true);
    
    setTimeout(() => {
      const allOptions = convertMockOptions();
      const filteredOptions = activeOnly 
        ? allOptions.filter(opt => opt.is_active) 
        : allOptions;
      
      setOptions(filteredOptions);
      setLoading(false);
    }, 300);
  };

  const getOptionsByType = (type: string) => {
    return options.filter(opt => opt.option_type === type);
  };

  return { options, loading, refetch: fetchOptions, getOptionsByType };
};
