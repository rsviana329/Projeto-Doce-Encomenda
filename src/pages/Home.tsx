import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Cake, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero py-20 md:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Bolos artesanais feitos com amor
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transforme seus momentos especiais em{' '}
              <span className="gradient-text">memórias doces</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie o bolo perfeito para sua celebração. Escolha sabores, recheios,
              coberturas e decorações. Cada bolo é único, assim como seu momento especial.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogo">
                <Button size="lg" variant="hero" className="text-base">
                  Ver Catálogo
                </Button>
              </Link>
              <Link to="/monte-seu-bolo">
                <Button size="lg" variant="outline" className="text-base">
                  Monte Seu Bolo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card hover:shadow-hover transition-smooth">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
              <Cake className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Personalização Total</h3>
            <p className="text-muted-foreground">
              Monte seu bolo do seu jeito. Escolha cada detalhe para criar algo único e especial.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card hover:shadow-hover transition-smooth">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Feito com Carinho</h3>
            <p className="text-muted-foreground">
              Cada bolo é preparado artesanalmente com ingredientes selecionados e muito amor.
            </p>
          </Card>

          <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card hover:shadow-hover transition-smooth">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Pedido Simples</h3>
            <p className="text-muted-foreground">
              Finalize seu pedido facilmente pelo WhatsApp. Rápido, prático e seguro.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para criar seu bolo dos sonhos?
          </h2>
          <Link to="/monte-seu-bolo">
            <Button size="lg" variant="hero" className="text-base">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
