import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { 
  mockProducts, 
  standardSizes, 
  standardFlavors, 
  standardFillings, 
  standardCoverings, 
  standardDecorations,
  layers 
} from '@/data/mockData';


const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOptionTab, setActiveOptionTab] = useState('size');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredOrders: any[] = [];

  const optionTypes = [
    { value: 'size', label: 'Tamanhos', options: standardSizes },
    { value: 'flavor', label: 'Sabores', options: standardFlavors },
    { value: 'filling', label: 'Recheios', options: standardFillings },
    { value: 'covering', label: 'Coberturas', options: standardCoverings },
    { value: 'decoration', label: 'Decorações', options: standardDecorations },
    { value: 'layer', label: 'Andares', options: layers },
  ];

  const getOptionsByType = (type: string) => {
    const typeConfig = optionTypes.find(t => t.value === type);
    return typeConfig?.options || [];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-white/80 backdrop-blur shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Painel Admin</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Gerencie pedidos, produtos e opções de customização
            </p>
          </div>

          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="options">Opções</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="text-center py-12 text-muted-foreground">
                Nenhum pedido salvo ainda. Os pedidos são enviados via WhatsApp.
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Produtos Cadastrados</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <Card key={product.id} className="gradient-card border-0 shadow-card">
                    <CardHeader>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Preço Base:</span>
                        <span className="text-lg font-bold text-primary">
                          R$ {product.basePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Tipo:</span>
                        <span className="text-sm">
                          {product.type === 'customizable' ? 'Personalizável' : 'Pronto'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className="text-sm text-green-600">
                          Ativo
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Options Tab */}
            <TabsContent value="options" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Opções de Customização</h2>
              </div>

              <Tabs value={activeOptionTab} onValueChange={setActiveOptionTab}>
                <TabsList className="grid w-full grid-cols-6">
                  {optionTypes.map(type => (
                    <TabsTrigger key={type.value} value={type.value}>
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {optionTypes.map(type => (
                  <TabsContent key={type.value} value={type.value} className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getOptionsByType(type.value).map((option) => (
                        <Card key={option.id} className="gradient-card border-0 shadow-card">
                          <CardHeader>
                            <CardTitle className="text-lg">{option.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {option.description && (
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Preço:</span>
                              <span className="text-lg font-bold text-primary">
                                {option.price > 0 ? `+ R$ ${option.price.toFixed(2)}` : 
                                 option.price < 0 ? `- R$ ${Math.abs(option.price).toFixed(2)}` : 
                                 'Incluído'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Status:</span>
                              <span className="text-sm text-green-600">Ativo</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
