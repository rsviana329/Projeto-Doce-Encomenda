import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading } = useProducts(true);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customizableProducts = filteredProducts.filter((p) => p.type === 'customizable');
  const readyMadeProducts = filteredProducts.filter((p) => p.type === 'ready-made');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Nosso <span className="gradient-text">Catálogo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore nossa seleção de bolos ou crie o seu do zero
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Custom Cake CTA */}
        <Link to="/monte-seu-bolo">
          <Card className="gradient-primary p-8 text-center cursor-pointer hover:shadow-hover transition-smooth border-0">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-white mb-2">
                🎨 Monte Seu Bolo Personalizado
              </h3>
              <p className="text-white/90">
                Crie do zero escolhendo cada detalhe do seu bolo dos sonhos
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Customizable Products */}
        {loading ? (
          <div className="text-center py-12">Carregando produtos...</div>
        ) : customizableProducts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Modelos Pré-Prontos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customizableProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden shadow-card hover:shadow-hover transition-smooth border-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
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
                        <Button variant="hero">Personalizar</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Ready-Made Products */}
        {readyMadeProducts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Modelos Prontos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyMadeProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden shadow-card hover:shadow-hover transition-smooth border-0 relative"
                >
                  <Badge className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground shadow-soft">
                    Modelo Pronto
                  </Badge>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
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
                        <Button variant="hero">Ver Modelo</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum produto encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;
