import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Cake } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const location = useLocation();
  const { items } = useCart();
  
  // Don't render navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-hover transition-smooth">
            <Cake className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:inline">
            Doce Encomenda
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/catalogo" className="hidden md:inline">
            <Button variant="ghost">Catálogo</Button>
          </Link>
          <Link to="/sobre" className="hidden md:inline">
            <Button variant="ghost">Sobre</Button>
          </Link>
          <Link to="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shadow-card">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
