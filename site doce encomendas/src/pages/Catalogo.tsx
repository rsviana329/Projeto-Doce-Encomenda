import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Filter, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';

const categories = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'frutas', label: 'Frutas' },
  { value: 'personalizado', label: 'Personalizado' },
  { value: 'casamento', label: 'Casamento' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'geral', label: 'Geral' },
];

const Catalogo = () => {
  const { products, loading: isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Filter only active products
  const activeProducts = useMemo(() => {
    return products.filter(p => p.is_active);
  }, [products]);

  const maxPrice = useMemo(() => {
    if (activeProducts.length === 0) return 500;
    return Math.max(...activeProducts.map((p) => p.base_price));
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesPrice =
        product.base_price >= priceRange[0] && product.base_price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, selectedCategory, priceRange, activeProducts]);

  const customizableProducts = filteredProducts.filter((p) => p.product_type === 'customizable');
  const readyMadeProducts = filteredProducts.filter((p) => p.product_type === 'ready-made');

  const hasActiveFilters = selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, maxPrice]);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center max-w-[600px] mx-auto text-center"
          >
            <div className="flex justify-center">
              <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground">
                Catálogo
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
              Nosso <span className="gradient-text">Catálogo</span>
            </h1>
            <p className="mt-5 text-muted-foreground max-w-md">
              Explore nossa seleção de bolos artesanais ou crie o seu do zero com todo carinho.
            </p>

            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-full max-w-md mt-8"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/80 backdrop-blur-sm border-border/50"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-muted/30 border border-border/40 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Filtros</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar filtros
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Categoria
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">
                    Faixa de Preço
                  </label>
                  <span className="text-sm text-primary font-medium">
                    R$ {priceRange[0]} - R$ {priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={0}
                  max={maxPrice}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R$ 0</span>
                  <span>R$ {maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find((c) => c.value === selectedCategory)?.label}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-primary"
                      onClick={() => setSelectedCategory('all')}
                    />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <Badge variant="secondary" className="gap-1">
                    R$ {priceRange[0]} - R$ {priceRange[1]}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-primary"
                      onClick={() => setPriceRange([0, maxPrice])}
                    />
                  </Badge>
                )}
              </div>
            )}
          </motion.div>

          {/* Custom Cake CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/monte-seu-bolo">
              <Card className="relative overflow-hidden p-8 text-center cursor-pointer hover:shadow-hover transition-smooth border border-border/40 bg-gradient-to-br from-primary/10 via-background to-primary/5 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold">
                      Monte Seu Bolo <span className="gradient-text">Personalizado</span>
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Crie do zero escolhendo cada detalhe do seu bolo dos sonhos
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Results Count */}
          {filteredProducts.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground text-center"
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </motion.p>
          )}

          {/* Customizable Products */}
          {customizableProducts.length > 0 && (
            <section className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground mb-4">
                  Personalizáveis
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter">
                  Modelos <span className="gradient-text">Pré-Prontos</span>
                </h2>
                <p className="mt-3 text-muted-foreground max-w-md">
                  Escolha um modelo e personalize do seu jeito
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customizableProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-hover transition-all duration-300 group">
                      <div className="relative overflow-hidden">
                        <Badge className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm text-foreground border border-border/40">
                          {categories.find((c) => c.value === product.category)?.label || product.category}
                        </Badge>
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-primary">
                            A partir de R$ {product.base_price.toFixed(2)}
                          </span>
                          <Link to={`/produto/${product.id}`}>
                            <Button size="sm">Personalizar</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Ready-Made Products */}
          {readyMadeProducts.length > 0 && (
            <section className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground mb-4">
                  Pronta Entrega
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter">
                  Modelos <span className="gradient-text">Prontos</span>
                </h2>
                <p className="mt-3 text-muted-foreground max-w-md">
                  Bolos prontos para encomenda imediata
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readyMadeProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-hover transition-all duration-300 group relative">
                      <Badge className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground">
                        Pronto
                      </Badge>
                      <Badge className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm text-foreground border border-border/40">
                        {categories.find((c) => c.value === product.category)?.label || product.category}
                      </Badge>
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-primary">
                            R$ {product.base_price.toFixed(2)}
                          </span>
                          <Link to={`/produto/${product.id}`}>
                            <Button size="sm">Ver Modelo</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 space-y-4"
            >
              <p className="text-lg text-muted-foreground">
                Nenhum produto encontrado com os filtros selecionados
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
