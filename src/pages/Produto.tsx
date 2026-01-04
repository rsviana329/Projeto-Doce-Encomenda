import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useCustomizationOptions } from '@/hooks/useCustomizationOptions';

const Produto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { products, loading: productsLoading } = useProducts();
  const { options, loading: optionsLoading } = useCustomizationOptions();

  const product = products.find((p) => p.id === id);

  const [size, setSize] = useState('');
  const [flavor, setFlavor] = useState('');
  const [filling, setFilling] = useState('');
  const [covering, setCovering] = useState('');
  const [decoration, setDecoration] = useState('');
  const [layersCount, setLayersCount] = useState('');
  const [notes, setNotes] = useState('');

  // Filter active options by type
  const activeOptions = useMemo(() => {
    const active = options.filter(opt => opt.is_active);
    return {
      sizes: active.filter(opt => opt.option_type === 'size'),
      flavors: active.filter(opt => opt.option_type === 'flavor'),
      fillings: active.filter(opt => opt.option_type === 'filling'),
      coverings: active.filter(opt => opt.option_type === 'covering'),
      decorations: active.filter(opt => opt.option_type === 'decoration'),
      layers: active.filter(opt => opt.option_type === 'layer'),
    };
  }, [options]);

  // Set default values when product loads
  useMemo(() => {
    if (product?.default_options) {
      const defaults = product.default_options as Record<string, string>;
      if (defaults.flavor && !flavor) setFlavor(defaults.flavor);
      if (defaults.filling && !filling) setFilling(defaults.filling);
      if (defaults.covering && !covering) setCovering(defaults.covering);
      if (defaults.decoration && !decoration) setDecoration(defaults.decoration);
    }
  }, [product]);

  const isLoading = productsLoading || optionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h1 className="text-3xl font-bold">Produto não encontrado</h1>
          <Link to="/catalogo">
            <Button className="gradient-primary text-white">Voltar ao Catálogo</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const getFilteredOptions = (optionsList: typeof activeOptions.sizes, allowedIds?: string[]) => {
    if (!allowedIds || allowedIds.length === 0) return optionsList;
    return optionsList.filter((opt) => allowedIds.includes(opt.id));
  };

  const calculateTotal = () => {
    if (product.product_type === 'ready-made') {
      return product.base_price;
    }

    let total = 0;
    
    const selectedSize = activeOptions.sizes.find((s) => s.id === size);
    if (selectedSize) {
      total = Number(selectedSize.price);
    } else {
      total = product.base_price;
    }

    const selectedFlavor = activeOptions.flavors.find((f) => f.id === flavor);
    if (selectedFlavor) total += Number(selectedFlavor.price);

    const selectedFilling = activeOptions.fillings.find((f) => f.id === filling);
    if (selectedFilling) total += Number(selectedFilling.price);

    const selectedCovering = activeOptions.coverings.find((c) => c.id === covering);
    if (selectedCovering) total += Number(selectedCovering.price);

    const selectedDecoration = activeOptions.decorations.find((d) => d.id === decoration);
    if (selectedDecoration) total += Number(selectedDecoration.price);

    const selectedLayers = activeOptions.layers.find((l) => l.id === layersCount);
    if (selectedLayers) total += Number(selectedLayers.price);

    return total;
  };

  const handleAddToCart = () => {
    if (product.product_type === 'customizable' && !size) {
      toast.error('Selecione um tamanho');
      return;
    }

    const selectedSize = activeOptions.sizes.find((s) => s.id === size);
    const selectedFlavor = activeOptions.flavors.find((f) => f.id === flavor);
    const selectedFilling = activeOptions.fillings.find((f) => f.id === filling);
    const selectedCovering = activeOptions.coverings.find((c) => c.id === covering);
    const selectedDecoration = activeOptions.decorations.find((d) => d.id === decoration);
    const selectedLayers = activeOptions.layers.find((l) => l.id === layersCount);

    const optionsData = product.product_type === 'ready-made' ? { notes } : {
      size: selectedSize?.name,
      flavor: selectedFlavor?.name,
      filling: selectedFilling?.name,
      covering: selectedCovering?.name,
      decoration: selectedDecoration?.name,
      layers: '1 Andar',
      notes,
    };

    addItem({
      productId: product.id,
      name: product.name,
      image: product.image_url || '/placeholder.svg',
      basePrice: product.base_price,
      options: optionsData,
      totalPrice: calculateTotal(),
      quantity: 1,
    });

    toast.success('Bolo adicionado ao carrinho!');
    navigate('/carrinho');
  };

  // Parse allowed options from product
  const allowedOptions = product.allowed_options as Record<string, string[]> | null;

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to="/catalogo">
              <Button variant="ghost" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Voltar ao Catálogo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="sticky top-24">
                <div className="relative overflow-hidden rounded-3xl shadow-xl">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                  {product.product_type === 'ready-made' && (
                    <div className="absolute top-4 left-4">
                      <Badge className="gradient-primary text-white border-0 px-4 py-2">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Modelo Pronto
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.product_type === 'ready-made' ? (
                <div className="space-y-6">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="text-4xl font-bold gradient-text">
                        R$ {product.base_price.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Sobre este modelo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Este é um modelo pronto com decoração e sabores já definidos.
                        Você pode adicionar observações especiais abaixo.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-lg font-semibold">Observações (Opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ex: dedicatória específica, pequenas alterações..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-24 bg-card/50 border-border/50"
                    />
                  </div>

                  <Button 
                    onClick={handleAddToCart} 
                    size="lg" 
                    className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground">A partir de</span>
                    <span className="text-2xl font-bold gradient-text">R$ {product.base_price.toFixed(2)}</span>
                  </div>

                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 space-y-6">
                      {/* Size */}
                      {activeOptions.sizes.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold">Tamanho *</Label>
                          <RadioGroup value={size} onValueChange={setSize}>
                            <div className="space-y-2">
                              {getFilteredOptions(activeOptions.sizes, allowedOptions?.sizes).map((s) => (
                                <div key={s.id} className="relative">
                                  <RadioGroupItem value={s.id} id={s.id} className="peer sr-only" />
                                  <Label
                                    htmlFor={s.id}
                                    className="flex justify-between items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                                  >
                                    <div>
                                      <span className="font-semibold text-foreground">{s.name}</span>
                                      {s.description && <span className="text-sm text-muted-foreground ml-2">{s.description}</span>}
                                    </div>
                                    <span className="text-primary font-semibold">R$ {Number(s.price).toFixed(2)}</span>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      {/* Flavor */}
                      {activeOptions.flavors.length > 0 && (
                        <div className="space-y-3">
                          <Label htmlFor="flavor" className="text-lg font-semibold">Sabor da Massa</Label>
                          <Select value={flavor} onValueChange={setFlavor}>
                            <SelectTrigger id="flavor" className="bg-background/50">
                              <SelectValue placeholder="Selecione o sabor" />
                            </SelectTrigger>
                            <SelectContent>
                              {getFilteredOptions(activeOptions.flavors, allowedOptions?.flavors).map((f) => (
                                <SelectItem key={f.id} value={f.id}>
                                  {f.name} {Number(f.price) > 0 && `(+R$ ${Number(f.price).toFixed(2)})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Filling */}
                      {activeOptions.fillings.length > 0 && (
                        <div className="space-y-3">
                          <Label htmlFor="filling" className="text-lg font-semibold">Recheio</Label>
                          <Select value={filling} onValueChange={setFilling}>
                            <SelectTrigger id="filling" className="bg-background/50">
                              <SelectValue placeholder="Selecione o recheio" />
                            </SelectTrigger>
                            <SelectContent>
                              {getFilteredOptions(activeOptions.fillings, allowedOptions?.fillings).map((f) => (
                                <SelectItem key={f.id} value={f.id}>
                                  {f.name} {Number(f.price) !== 0 && `(${Number(f.price) > 0 ? '+' : ''}R$ ${Number(f.price).toFixed(2)})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Covering */}
                      {activeOptions.coverings.length > 0 && (
                        <div className="space-y-3">
                          <Label htmlFor="covering" className="text-lg font-semibold">Cobertura</Label>
                          <Select value={covering} onValueChange={setCovering}>
                            <SelectTrigger id="covering" className="bg-background/50">
                              <SelectValue placeholder="Selecione a cobertura" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeOptions.coverings.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name} {Number(c.price) !== 0 && `(${Number(c.price) > 0 ? '+' : ''}R$ ${Number(c.price).toFixed(2)})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Decoration */}
                      {activeOptions.decorations.length > 0 && (
                        <div className="space-y-3">
                          <Label htmlFor="decoration" className="text-lg font-semibold">Decoração</Label>
                          <Select value={decoration} onValueChange={setDecoration}>
                            <SelectTrigger id="decoration" className="bg-background/50">
                              <SelectValue placeholder="Selecione a decoração" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeOptions.decorations.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                  {d.name} {Number(d.price) !== 0 && `(${Number(d.price) > 0 ? '+' : ''}R$ ${Number(d.price).toFixed(2)})`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Layers */}
                      {activeOptions.layers.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold">Número de Andares</Label>
                          <RadioGroup value={layersCount} onValueChange={setLayersCount}>
                            <div className="grid grid-cols-3 gap-3">
                              {activeOptions.layers.map((l) => (
                                <div key={l.id} className="relative">
                                  <RadioGroupItem value={l.id} id={`layer-${l.id}`} className="peer sr-only" />
                                  <Label
                                    htmlFor={`layer-${l.id}`}
                                    className="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                                  >
                                    <span className="font-semibold text-foreground">{l.name}</span>
                                    {Number(l.price) > 0 && (
                                      <span className="text-sm text-primary">+R$ {Number(l.price).toFixed(2)}</span>
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      {/* Notes */}
                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-lg font-semibold">Observações</Label>
                        <Textarea
                          id="notes"
                          placeholder="Ex: dedicatória, cores específicas..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-20 bg-background/50"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle>Resumo do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Total:</span>
                        <span className="text-3xl font-bold gradient-text">R$ {calculateTotal().toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    onClick={handleAddToCart} 
                    size="lg" 
                    className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Produto;
