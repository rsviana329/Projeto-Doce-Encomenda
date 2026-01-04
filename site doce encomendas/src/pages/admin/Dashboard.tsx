import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, Package, ShoppingBag, Settings, ChevronDown, ChevronUp, MapPin, FileText, Image, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAdmin } from '@/contexts/AdminContext';
import { useOrders } from '@/hooks/useOrders';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCustomizationOptions, CustomizationOption } from '@/hooks/useCustomizationOptions';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { OptionFormDialog } from '@/components/admin/OptionFormDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAdmin();
  
  const [activeOptionTab, setActiveOptionTab] = useState('size');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  // Orders state
  const { orders, loading: ordersLoading, updateOrderStatus, deleteOrder } = useOrders();
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Products state
  const { products, loading: productsLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Options state
  const { options, loading: optionsLoading, createOption, updateOption, deleteOption, getOptionsByType } = useCustomizationOptions();
  const [optionDialogOpen, setOptionDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<CustomizationOption | null>(null);
  const [optionToDelete, setOptionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const optionTypes = [
    { value: 'size', label: 'Tamanhos' },
    { value: 'flavor', label: 'Sabores' },
    { value: 'filling', label: 'Recheios' },
    { value: 'covering', label: 'Coberturas' },
    { value: 'decoration', label: 'Decorações' },
    { value: 'layer', label: 'Andares' },
  ];

  const handleProductSubmit = async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
    setEditingProduct(null);
  };

  const handleOptionSubmit = async (data: Omit<CustomizationOption, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingOption) {
      await updateOption(editingOption.id, data);
    } else {
      await createOption(data);
    }
    setEditingOption(null);
  };

  const orderStatuses = [
    { value: 'pending', label: 'Pendente', variant: 'secondary' as const },
    { value: 'confirmed', label: 'Confirmado', variant: 'default' as const },
    { value: 'preparing', label: 'Preparando', variant: 'outline' as const },
    { value: 'ready', label: 'Pronto', variant: 'default' as const },
    { value: 'delivered', label: 'Entregue', variant: 'default' as const },
    { value: 'cancelled', label: 'Cancelado', variant: 'destructive' as const },
  ];

  const getStatusBadge = (status: string) => {
    const config = orderStatuses.find(s => s.value === status) || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Date range filter
      if (dateRange?.from) {
        const orderDate = parseISO(order.created_at);
        const from = startOfDay(dateRange.from);
        const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        
        if (!isWithinInterval(orderDate, { start: from, end: to })) {
          return false;
        }
      }
      
      return true;
    });
  }, [orders, statusFilter, dateRange]);

  const clearFilters = () => {
    setStatusFilter('all');
    setDateRange(undefined);
  };

  const hasActiveFilters = statusFilter !== 'all' || dateRange?.from;

  return (
    <div className="min-h-screen gradient-hero">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-card/80 backdrop-blur shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Painel Admin</h1>
          <Button variant="ghost" onClick={handleLogout} className="hover:bg-secondary">
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Gerencie pedidos, produtos e opções de customização
            </p>
          </div>

          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-card shadow-soft">
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                <ShoppingBag className="w-4 h-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                <Package className="w-4 h-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="options" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                <Settings className="w-4 h-4" />
                Opções
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
                <Badge variant="outline" className="text-sm">
                  {filteredOrders.length} de {orders.length} pedido{orders.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Filters */}
              <Card className="gradient-card border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Filtros:</span>
                    </div>
                    
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48 bg-background/50">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        {orderStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Date Range Filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto justify-start bg-background/50">
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                              </>
                            ) : (
                              format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                            )
                          ) : (
                            <span className="text-muted-foreground">Período</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={1}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {ordersLoading ? (
                <div className="text-center py-12 text-muted-foreground">Carregando...</div>
              ) : filteredOrders.length === 0 ? (
                <Card className="gradient-card border-0 shadow-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{orders.length === 0 ? 'Nenhum pedido registrado ainda.' : 'Nenhum pedido encontrado com os filtros selecionados.'}</p>
                    {hasActiveFilters && (
                      <Button variant="link" onClick={clearFilters} className="mt-2">
                        Limpar filtros
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrders.has(order.id);
                    return (
                      <Card key={order.id} className="gradient-card border-0 shadow-card hover:shadow-hover transition-smooth">
                        <Collapsible open={isExpanded} onOpenChange={() => toggleOrderExpanded(order.id)}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                                  {getStatusBadge(order.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {order.customer_phone}
                                  {order.customer_email && ` • ${order.customer_email}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Pedido em: {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                                {order.delivery_date && (
                                  <p className="text-sm text-muted-foreground">
                                    Entrega: {format(new Date(order.delivery_date), 'dd/MM/yyyy', { locale: ptBR })}
                                    {order.delivery_time && ` às ${order.delivery_time}`}
                                  </p>
                                )}
                                {order.items.length > 0 && (
                                  <p className="text-sm">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-3">
                                <span className="text-2xl font-bold text-primary">
                                  R$ {order.total.toFixed(2)}
                                </span>
                                <div className="flex gap-2">
                                  <CollapsibleTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="w-4 h-4 mr-2" />
                                          Ocultar
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-4 h-4 mr-2" />
                                          Detalhes
                                        </>
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setOrderToDelete(order.id)}
                                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <CollapsibleContent className="mt-6 pt-6 border-t border-border/50 space-y-4">
                              {/* Items Details */}
                              <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Package className="w-4 h-4 text-primary" />
                                  Itens do Pedido
                                </h4>
                                <div className="grid gap-3">
                                  {order.items.map((item: any, index: number) => (
                                    <div key={index} className="bg-background/50 rounded-lg p-4 space-y-3">
                                      <div className="flex items-start gap-4">
                                        {/* Imagens do pedido */}
                                        {(item.customImage || item.productImage) && (
                                          <div className="flex-shrink-0 flex gap-2">
                                            {item.customImage && (
                                              <div className="relative group">
                                                <img 
                                                  src={item.customImage} 
                                                  alt={`${item.name} - Personalizada`}
                                                  className="w-20 h-20 rounded-lg object-cover border border-primary/50 cursor-pointer hover:scale-105 transition-transform"
                                                  onClick={() => window.open(item.customImage, '_blank')}
                                                />
                                                <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                                  {item.customImage.startsWith('data:') ? 'IA' : 'Upload'}
                                                </span>
                                              </div>
                                            )}
                                            {item.productImage && (
                                              <div className="relative group">
                                                <img 
                                                  src={item.productImage} 
                                                  alt={`${item.name} - Produto`}
                                                  className="w-20 h-20 rounded-lg object-cover border border-border cursor-pointer hover:scale-105 transition-transform"
                                                  onClick={() => window.open(item.productImage, '_blank')}
                                                />
                                                <span className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                                  Catálogo
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        <div className="flex-1 space-y-1">
                                          <div className="flex justify-between items-start">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="font-semibold text-primary">
                                              R$ {(item.totalPrice * item.quantity).toFixed(2)}
                                            </span>
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            Quantidade: {item.quantity}
                                          </p>
                                          {item.options && Object.keys(item.options).length > 0 && (
                                            <div className="text-sm text-muted-foreground space-y-0.5">
                                              {Object.entries(item.options)
                                                .filter(([_, value]) => value && value !== '')
                                                .map(([key, value]) => (
                                                  <p key={key}>
                                                    <span className="capitalize">{key}:</span> {String(value)}
                                                  </p>
                                                ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Delivery Address */}
                              {order.delivery_address && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Endereço de Entrega
                                  </h4>
                                  <p className="text-sm text-muted-foreground bg-background/50 rounded-lg p-3">
                                    {order.delivery_address}
                                  </p>
                                </div>
                              )}

                              {/* Notes */}
                              {order.notes && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Observações
                                  </h4>
                                  <p className="text-sm text-muted-foreground bg-background/50 rounded-lg p-3">
                                    {order.notes}
                                  </p>
                                </div>
                              )}

                              {/* Status Selector */}
                              <div className="space-y-2 pt-2 border-t border-border/50">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Settings className="w-4 h-4 text-primary" />
                                  Alterar Status
                                </h4>
                                <Select 
                                  value={order.status} 
                                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                                >
                                  <SelectTrigger className="w-full md:w-64 bg-background/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {orderStatuses.map((status) => (
                                      <SelectItem key={status.value} value={status.value}>
                                        <span className="flex items-center gap-2">
                                          {status.label}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </CollapsibleContent>
                          </CardContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Produtos Cadastrados</h2>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductDialogOpen(true);
                  }}
                  className="gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>

              {productsLoading ? (
                <div className="text-center py-12 text-muted-foreground">Carregando...</div>
              ) : products.length === 0 ? (
                <Card className="gradient-card border-0 shadow-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum produto cadastrado ainda.</p>
                    <Button
                      onClick={() => setProductDialogOpen(true)}
                      className="mt-4 gradient-primary text-primary-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar primeiro produto
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="gradient-card border-0 shadow-card hover:shadow-hover transition-smooth overflow-hidden">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Preço Base:</span>
                          <span className="text-lg font-bold text-primary">
                            R$ {product.base_price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Tipo:</span>
                          <span className="text-sm">
                            {product.product_type === 'customizable' ? 'Personalizável' : 'Pronto'}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setEditingProduct(product);
                              setProductDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setProductToDelete(product.id)}
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
                <Button
                  onClick={() => {
                    setEditingOption(null);
                    setOptionDialogOpen(true);
                  }}
                  className="gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Opção
                </Button>
              </div>

              <Tabs value={activeOptionTab} onValueChange={setActiveOptionTab}>
                <TabsList className="grid w-full grid-cols-6 bg-card shadow-soft">
                  {optionTypes.map(type => (
                    <TabsTrigger 
                      key={type.value} 
                      value={type.value}
                      className="text-xs md:text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
                    >
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {optionTypes.map(type => {
                  const typeOptions = getOptionsByType(type.value);
                  return (
                    <TabsContent key={type.value} value={type.value} className="space-y-4 mt-6">
                      {optionsLoading ? (
                        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
                      ) : typeOptions.length === 0 ? (
                        <Card className="gradient-card border-0 shadow-card">
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhuma opção de {type.label.toLowerCase()} cadastrada.</p>
                            <Button
                              onClick={() => {
                                setEditingOption(null);
                                setActiveOptionTab(type.value);
                                setOptionDialogOpen(true);
                              }}
                              className="mt-4 gradient-primary text-primary-foreground"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Adicionar {type.label.toLowerCase()}
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {typeOptions.map((option) => (
                            <Card key={option.id} className="gradient-card border-0 shadow-card hover:shadow-hover transition-smooth">
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <CardTitle className="text-lg">{option.name}</CardTitle>
                                  <Badge variant={option.is_active ? 'default' : 'secondary'}>
                                    {option.is_active ? 'Ativo' : 'Inativo'}
                                  </Badge>
                                </div>
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
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                      setEditingOption(option);
                                      setOptionDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => setOptionToDelete(option.id)}
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
                  );
                })}
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <ProductFormDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={editingProduct}
        onSubmit={handleProductSubmit}
      />

      <OptionFormDialog
        open={optionDialogOpen}
        onOpenChange={setOptionDialogOpen}
        option={editingOption}
        defaultType={activeOptionTab}
        onSubmit={handleOptionSubmit}
      />

      <DeleteConfirmDialog
        open={!!orderToDelete}
        onOpenChange={() => setOrderToDelete(null)}
        title="Excluir pedido?"
        description="Esta ação não pode ser desfeita. O pedido será removido permanentemente."
        onConfirm={() => {
          if (orderToDelete) {
            deleteOrder(orderToDelete);
            setOrderToDelete(null);
          }
        }}
      />

      <DeleteConfirmDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
        title="Excluir produto?"
        description="Esta ação não pode ser desfeita. O produto será removido permanentemente."
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete);
            setProductToDelete(null);
          }
        }}
      />

      <DeleteConfirmDialog
        open={!!optionToDelete}
        onOpenChange={() => setOptionToDelete(null)}
        title="Excluir opção?"
        description="Esta ação não pode ser desfeita. A opção será removida permanentemente."
        onConfirm={() => {
          if (optionToDelete) {
            deleteOption(optionToDelete);
            setOptionToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
