export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  category: string;
  isActive: boolean;
  type: 'customizable' | 'ready-made';
  allowedOptions?: {
    flavors?: string[];
    fillings?: string[];
    sizes?: string[];
    themes?: string[];
    colors?: string[];
    layers?: string[];
  };
  defaultOptions?: {
    flavor?: string;
    filling?: string;
    covering?: string;
    decoration?: string;
  };
}

export const standardSizes: CustomizationOption[] = [
  { id: 'pequeno', name: 'Pequeno (15cm)', price: 50, description: '8-10 porções' },
  { id: 'medio', name: 'Médio (20cm)', price: 80, description: '15-20 porções' },
  { id: 'grande', name: 'Grande (25cm)', price: 120, description: '25-30 porções' },
  { id: 'gigante', name: 'Gigante (30cm)', price: 180, description: '40-50 porções' },
];

export const standardFlavors: CustomizationOption[] = [
  { id: 'chocolate', name: 'Chocolate', price: 0 },
  { id: 'baunilha', name: 'Baunilha', price: 0 },
  { id: 'morango', name: 'Morango', price: 10 },
  { id: 'laranja', name: 'Laranja', price: 5 },
  { id: 'coco', name: 'Coco', price: 8 },
  { id: 'red-velvet', name: 'Red Velvet', price: 15 },
  { id: 'limao', name: 'Limão', price: 8 },
  { id: 'mesclado', name: 'Mesclado', price: 12 },
  { id: 'cenoura', name: 'Cenoura', price: 0 },
];

export const standardFillings: CustomizationOption[] = [
  { id: 'brigadeiro', name: 'Brigadeiro', price: 0 },
  { id: 'doce-leite', name: 'Doce de Leite', price: 10 },
  { id: 'ganache', name: 'Ganache', price: 15 },
  { id: 'creme-morango', name: 'Creme de Morango', price: 15 },
  { id: 'mousse-chocolate', name: 'Mousse de Chocolate', price: 12 },
  { id: 'mousse-maracuja', name: 'Mousse de Maracujá', price: 12 },
  { id: 'creme-avela', name: 'Creme de Avelã (Nutella)', price: 25 },
  { id: 'frutas-vermelhas', name: 'Frutas Vermelhas', price: 20 },
  { id: 'sem-recheio', name: 'Sem Recheio', price: -10 },
];

export const standardCoverings: CustomizationOption[] = [
  { id: 'chantilly', name: 'Chantilly', price: 0 },
  { id: 'ganache', name: 'Ganache', price: 15 },
  { id: 'pasta-americana', name: 'Pasta Americana', price: 20 },
  { id: 'glace-real', name: 'Glacê Real', price: 10 },
  { id: 'cobertura-chocolate', name: 'Cobertura de Chocolate', price: 12 },
  { id: 'buttercream', name: 'Buttercream', price: 15 },
  { id: 'naked-cake', name: 'Naked Cake (Sem Cobertura)', price: -5 },
];

export const standardDecorations: CustomizationOption[] = [
  { id: 'flores-naturais', name: 'Flores Naturais', price: 30 },
  { id: 'flores-acucar', name: 'Flores de Açúcar', price: 40 },
  { id: 'frutas-frescas', name: 'Frutas Frescas', price: 25 },
  { id: 'chocolate-raspado', name: 'Chocolate Raspado', price: 15 },
  { id: 'confetes', name: 'Confetes', price: 10 },
  { id: 'topo-personalizado', name: 'Topo Personalizado', price: 35 },
  { id: 'simples', name: 'Simples/Minimalista', price: 0 },
  { id: 'tema-infantil', name: 'Tema Infantil', price: 50 },
  { id: 'tema-adulto', name: 'Tema Adulto', price: 45 },
];

export const layers: CustomizationOption[] = [
  { id: '1', name: '1 Andar', price: 0 },
  { id: '2', name: '2 Andares', price: 50 },
  { id: '3', name: '3 Andares', price: 100 },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bolo Clássico de Chocolate',
    description: 'Delicioso bolo de chocolate com recheio cremoso. Personalize do seu jeito!',
    image: new URL('../assets/bolo-classico-chocolate.jpg', import.meta.url).href,
    basePrice: 80,
    category: 'chocolate',
    isActive: true,
    type: 'customizable',
    allowedOptions: {
      flavors: ['chocolate', 'mesclado'],
      fillings: ['brigadeiro', 'ganache', 'mousse-chocolate', 'doce-leite'],
    },
    defaultOptions: {
      flavor: 'chocolate',
      filling: 'brigadeiro',
      covering: 'ganache',
      decoration: 'simples',
    },
  },
  {
    id: '2',
    name: 'Bolo de Morango',
    description: 'Suave bolo de morango com recheio especial. Perfeito para qualquer ocasião!',
    image: new URL('../assets/bolo-morango.jpg', import.meta.url).href,
    basePrice: 90,
    category: 'frutas',
    isActive: true,
    type: 'customizable',
    allowedOptions: {
      flavors: ['baunilha', 'morango', 'limao'],
      fillings: ['creme-morango', 'mousse-maracuja', 'frutas-vermelhas', 'sem-recheio'],
    },
    defaultOptions: {
      flavor: 'baunilha',
      filling: 'creme-morango',
      covering: 'chantilly',
      decoration: 'frutas-frescas',
    },
  },
  {
    id: '3',
    name: 'Bolo de Aniversário Personalizado',
    description: 'Crie o bolo perfeito para sua festa! Escolha sabores, recheios e decoração.',
    image: new URL('../assets/bolo-aniversario-personalizado.jpg', import.meta.url).href,
    basePrice: 100,
    category: 'personalizado',
    isActive: true,
    type: 'customizable',
    defaultOptions: {
      flavor: 'chocolate',
      filling: 'brigadeiro',
      covering: 'chantilly',
      decoration: 'flores-acucar',
    },
  },
  {
    id: '4',
    name: 'Bolo 3 Andares Rosa e Dourado',
    description: 'Modelo pronto - Bolo de 3 andares com decoração em rosa claro e detalhes dourados. Sabor red velvet com recheio de cream cheese. Perfeito para casamentos e festas elegantes.',
    image: new URL('../assets/bolo-casamento-rosa.jpg', import.meta.url).href,
    basePrice: 250,
    category: 'casamento',
    isActive: true,
    type: 'ready-made',
  },
  {
    id: '5',
    name: 'Bolo Infantil Unicórnio',
    description: 'Modelo pronto - Bolo temático de unicórnio com chifre dourado, orelhas e flores comestíveis. Sabor baunilha com recheio de brigadeiro. Encanta crianças de todas as idades!',
    image: new URL('../assets/bolo-unicornio.jpg', import.meta.url).href,
    basePrice: 180,
    category: 'infantil',
    isActive: true,
    type: 'ready-made',
  },
];
