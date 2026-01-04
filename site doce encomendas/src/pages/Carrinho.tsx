import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const CartSkeleton = () => (
  <div className="min-h-screen bg-background">
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <Skeleton className="h-6 w-32 mb-4 rounded-full" />
            <Skeleton className="h-12 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </section>
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="border border-border/50 backdrop-blur-sm bg-card/80">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Skeleton className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-8 w-full rounded-lg" />
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-28" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Skeleton className="h-48 w-full rounded-xl mt-8" />
        </div>
      </div>
    </section>
  </div>
);

const Carrinho = () => {
  const { items, removeItem, clearCart, total } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClearCart = () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearCart();
      toast.success('Carrinho limpo com sucesso');
    }
  };

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-28 h-28 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow"
              >
                <ShoppingBag className="w-14 h-14 text-primary-foreground" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Seu carrinho está <span className="gradient-text">vazio</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Explore nosso catálogo e encontre o bolo perfeito para você!
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/catalogo">
                  <Button variant="hero" size="lg" className="gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Ver Catálogo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="text-center md:text-left">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4"
              >
                {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
              </motion.span>
              <h1 className="text-4xl md:text-5xl font-bold">
                Meu <span className="gradient-text">Carrinho</span>
              </h1>
            </div>
            <Link to="/catalogo">
              <Button variant="outline" className="gap-2 backdrop-blur-sm bg-background/50">
                <ArrowLeft className="w-4 h-4" />
                Continuar Comprando
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Items */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-border/50 backdrop-blur-sm bg-card/80 shadow-soft overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative group">
                          <img
                            src={item.customImage || item.image}
                            alt={item.name}
                            className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl object-cover shadow-soft transition-transform duration-300 group-hover:scale-105"
                          />
                          {item.customImage && (
                            <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded-lg backdrop-blur-sm">
                              Personalizado
                            </span>
                          )}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{item.name}</h3>
                              {item.options && (
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                  {item.options.size && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      📏 {item.options.size}
                                    </span>
                                  )}
                                  {item.options.flavor && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      🎂 {item.options.flavor}
                                    </span>
                                  )}
                                  {item.options.filling && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      🍫 {item.options.filling}
                                    </span>
                                  )}
                                  {item.options.covering && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      🎨 {item.options.covering}
                                    </span>
                                  )}
                                  {item.options.decoration && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      ✨ {item.options.decoration}
                                    </span>
                                  )}
                                  {item.options.layers && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      🎂 {item.options.layers} andares
                                    </span>
                                  )}
                                  {item.options.theme && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      🎪 {item.options.theme}
                                    </span>
                                  )}
                                  {item.options.color && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                                      🎨 {item.options.color}
                                    </span>
                                  )}
                                  {item.options.notes && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 col-span-2">
                                      📝 {item.options.notes}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-destructive/10 transition-colors"
                              onClick={() => {
                                removeItem(item.id);
                                toast.success('Item removido do carrinho');
                              }}
                            >
                              <Trash2 className="w-5 h-5 text-destructive" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <span className="text-sm text-muted-foreground">
                              Quantidade: <span className="font-semibold text-foreground">{item.quantity}</span>
                            </span>
                            <span className="text-2xl font-bold gradient-text">
                              R$ {(item.totalPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 gradient-primary shadow-glow overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg text-primary-foreground/80">
                      <span>Subtotal:</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-primary-foreground/20" />
                    <div className="flex justify-between text-3xl font-bold text-primary-foreground">
                      <span>Total:</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/checkout" className="flex-1">
                      <Button 
                        size="lg" 
                        className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-semibold"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Finalizar Pedido
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={handleClearCart}
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Limpar Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Carrinho;
