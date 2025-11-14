import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Carrinho = () => {
  const { items, removeItem, clearCart, total } = useCart();

  const handleClearCart = () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearCart();
      toast.success('Carrinho limpo com sucesso');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-card">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Seu carrinho está vazio</h1>
          <p className="text-lg text-muted-foreground">
            Explore nosso catálogo e encontre o bolo perfeito para você!
          </p>
          <Link to="/catalogo">
            <Button variant="hero" size="lg">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">
            Meu <span className="gradient-text">Carrinho</span>
          </h1>
          <Link to="/catalogo">
            <Button variant="ghost">Continuar Comprando</Button>
          </Link>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 rounded-2xl object-cover shadow-soft"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        {item.options && (
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {item.options.size && <p>📏 Tamanho: {item.options.size}</p>}
                            {item.options.flavor && <p>🎂 Sabor: {item.options.flavor}</p>}
                            {item.options.filling && <p>🍫 Recheio: {item.options.filling}</p>}
                            {item.options.covering && <p>🎨 Cobertura: {item.options.covering}</p>}
                            {item.options.decoration && <p>✨ Decoração: {item.options.decoration}</p>}
                            {item.options.layers && <p>🎂 Andares: {item.options.layers}</p>}
                            {item.options.theme && <p>🎪 Tema: {item.options.theme}</p>}
                            {item.options.color && <p>🎨 Cor: {item.options.color}</p>}
                            {item.options.notes && <p>📝 Obs: {item.options.notes}</p>}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeItem(item.id);
                          toast.success('Item removido do carrinho');
                        }}
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        R$ {(item.totalPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="gradient-card border-0 shadow-card">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-3xl font-bold">
                <span>Total:</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/checkout" className="flex-1">
                <Button variant="hero" size="lg" className="w-full">
                  Finalizar Pedido
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={handleClearCart}>
                Limpar Carrinho
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Carrinho;
