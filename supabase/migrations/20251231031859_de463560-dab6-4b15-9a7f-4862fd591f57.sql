-- Tabela de pedidos
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT,
  delivery_date DATE,
  delivery_time TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'geral',
  is_active BOOLEAN NOT NULL DEFAULT true,
  product_type TEXT NOT NULL DEFAULT 'customizable',
  allowed_options JSONB DEFAULT '{}'::jsonb,
  default_options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de opções de customização
CREATE TABLE public.customization_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  option_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_options ENABLE ROW LEVEL SECURITY;

-- Policies para orders (admin pode tudo, público pode inserir)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE USING (true);

-- Policies para products (público pode ver, admin pode tudo)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can create products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- Policies para customization_options
CREATE POLICY "Anyone can view options" ON public.customization_options FOR SELECT USING (true);
CREATE POLICY "Anyone can create options" ON public.customization_options FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update options" ON public.customization_options FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete options" ON public.customization_options FOR DELETE USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cake_reservations_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cake_reservations_updated_at();

CREATE TRIGGER update_customization_options_updated_at
  BEFORE UPDATE ON public.customization_options
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cake_reservations_updated_at();

-- Inserir opções iniciais de customização
INSERT INTO public.customization_options (option_type, name, description, price) VALUES
-- Tamanhos
('size', 'Pequeno (15cm)', '8-10 porções', 50),
('size', 'Médio (20cm)', '15-20 porções', 80),
('size', 'Grande (25cm)', '25-30 porções', 120),
('size', 'Gigante (30cm)', '40-50 porções', 180),
-- Sabores
('flavor', 'Chocolate', NULL, 0),
('flavor', 'Baunilha', NULL, 0),
('flavor', 'Morango', NULL, 10),
('flavor', 'Laranja', NULL, 5),
('flavor', 'Coco', NULL, 8),
('flavor', 'Red Velvet', NULL, 15),
('flavor', 'Limão', NULL, 8),
('flavor', 'Mesclado', NULL, 12),
('flavor', 'Cenoura', NULL, 0),
-- Recheios
('filling', 'Brigadeiro', NULL, 0),
('filling', 'Doce de Leite', NULL, 10),
('filling', 'Ganache', NULL, 15),
('filling', 'Creme de Morango', NULL, 15),
('filling', 'Mousse de Chocolate', NULL, 12),
('filling', 'Mousse de Maracujá', NULL, 12),
('filling', 'Creme de Avelã (Nutella)', NULL, 25),
('filling', 'Frutas Vermelhas', NULL, 20),
('filling', 'Sem Recheio', NULL, -10),
-- Coberturas
('covering', 'Chantilly', NULL, 0),
('covering', 'Ganache', NULL, 15),
('covering', 'Pasta Americana', NULL, 20),
('covering', 'Glacê Real', NULL, 10),
('covering', 'Cobertura de Chocolate', NULL, 12),
('covering', 'Buttercream', NULL, 15),
('covering', 'Naked Cake (Sem Cobertura)', NULL, -5),
-- Decorações
('decoration', 'Flores Naturais', NULL, 30),
('decoration', 'Flores de Açúcar', NULL, 40),
('decoration', 'Frutas Frescas', NULL, 25),
('decoration', 'Chocolate Raspado', NULL, 15),
('decoration', 'Confetes', NULL, 10),
('decoration', 'Topo Personalizado', NULL, 35),
('decoration', 'Simples/Minimalista', NULL, 0),
('decoration', 'Tema Infantil', NULL, 50),
('decoration', 'Tema Adulto', NULL, 45),
-- Andares
('layer', '1 Andar', NULL, 0),
('layer', '2 Andares', NULL, 50),
('layer', '3 Andares', NULL, 100);