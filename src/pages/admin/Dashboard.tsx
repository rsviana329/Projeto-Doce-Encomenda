import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/hooks/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import CustomizationOptionForm from '@/components/admin/CustomizationOptionForm';
import { useProducts } from '@/hooks/useProducts';
import { useCustomizationOptions } from '@/hooks/useCustomizationOptions';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  delivery_date: string;
  delivery_time: string;
  total_price: number;
  notes: string;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  base_price: number;
  category: string;
  is_active: boolean;
  type: 'customizable' | 'ready-made';
  allowed_options?: any;
  default_options?: any;
}

interface CustomizationOption {
  id: string;
  option_type: string;
  option_id: string;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAdmin();
  
  // Usar hooks para produtos e opções
  const { products: productsData, loading: productsLoading, refetch: refetchProducts } = useProducts(false);
  const { options: optionsData, loading: optionsLoading, getOptionsByType } = useCustomizationOptions(false);
  
  // Orders state (vazio pois não há banco de dados)
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Products state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  
  // Options state
  const [editingOption, setEditingOption] = useState<CustomizationOption | null>(null);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [activeOptionTab, setActiveOptionTab] = useState('size');
  
  const loading = productsLoading || optionsLoading;
  const products = productsData;
  const options = optionsData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Product handlers
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    toast({
      title: 'Informação',
      description: 'Exclusão de produtos não está disponível sem banco de dados.',
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const handleProductFormSuccess = () => {
    setIsProductDialogOpen(false);
    setEditingProduct(null);
    refetchProducts();
  };

  // Option handlers
  const handleDeleteOption = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta opção?')) return;

    toast({
      title: 'Informação',
      description: 'Exclusão de opções não está disponível sem banco de dados.',
    });
  };

  const handleEditOption = (option: CustomizationOption) => {
    setEditingOption(option);
    setIsOptionDialogOpen(true);
  };

  const handleAddOption = () => {
    setEditingOption(null);
    setIsOptionDialogOpen(true);
  };

  const handleOptionFormSuccess = () => {
    setIsOptionDialogOpen(false);
    setEditingOption(null);
    // Não precisa refetch pois os dados são mock
  };

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const optionTypes = [
    { value: 'size', label: 'Tamanhos' },
    { value: 'flavor', label: 'Sabores' },
    { value: 'filling', label: 'Recheios' },
    { value: 'covering', label: 'Coberturas' },
    { value: 'decoration', label: 'Decorações' },
    { value: 'layer', label: 'Andares' },
  ];

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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Buscar por nome do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="text-center py-12">Carregando pedidos...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerm ? 'Nenhum pedido encontrado com esse nome.' : 'Nenhum pedido ainda.'}
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="gradient-card border-0 shadow-card">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <div>
                            <div className="text-xl">{order.customer_name}</div>
                            <div className="text-sm text-muted-foreground font-normal mt-1">
                              Pedido #{order.id.slice(0, 8)}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            R$ {order.total_price.toFixed(2)}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Contato</p>
                            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Entrega</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.delivery_date).toLocaleDateString('pt-BR')} às {order.delivery_time}
                            </p>
                            {order.customer_address && (
                              <p className="text-sm text-muted-foreground">{order.customer_address}</p>
                            )}
                          </div>
                        </div>
                        {order.notes && (
                          <div>
                            <p className="text-sm font-medium">Observações</p>
                            <p className="text-sm text-muted-foreground">{order.notes}</p>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <p className="text-xs text-muted-foreground">
                            Pedido feito em {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Produtos Cadastrados</h2>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddProduct}>
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Produto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                      </DialogTitle>
                    </DialogHeader>
                    <ProductForm
                      product={editingProduct}
                      onSuccess={handleProductFormSuccess}
                      onCancel={() => setIsProductDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="text-center py-12">Carregando produtos...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum produto cadastrado ainda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="gradient-card border-0 shadow-card">
                      <CardHeader>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Preço Base:</span>
                          <span className="text-lg font-bold text-primary">
                            R$ {product.base_price.toFixed(2)}
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
                          <span className={`text-sm ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {product.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Options Tab */}
            <TabsContent value="options" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Opções de Customização</h2>
                <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddOption}>
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Opção
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingOption ? 'Editar Opção' : 'Nova Opção'}
                      </DialogTitle>
                    </DialogHeader>
                    <CustomizationOptionForm
                      option={editingOption}
                      onSuccess={handleOptionFormSuccess}
                      onCancel={() => setIsOptionDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="text-center py-12">Carregando opções...</div>
              ) : (
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
                      {getOptionsByType(type.value).length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          Nenhuma opção cadastrada nesta categoria.
                        </div>
                      ) : (
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
                                  <span className={`text-sm ${option.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                    {option.is_active ? 'Ativo' : 'Inativo'}
                                  </span>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleEditOption(option)}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteOption(option.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
