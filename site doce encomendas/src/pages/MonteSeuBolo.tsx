import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cake, Sparkles, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { CakePreview } from '@/components/CakePreview';
import { useCustomizationOptions } from '@/hooks/useCustomizationOptions';

const MonteSeuBolo = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { options, loading: isLoading } = useCustomizationOptions();

  const [size, setSize] = useState('');
  const [flavor, setFlavor] = useState('');
  const [filling, setFilling] = useState('');
  const [covering, setCovering] = useState('');
  const [decoration, setDecoration] = useState('');
  const [layersCount, setLayersCount] = useState('1');
  const [notes, setNotes] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);

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

  const calculateTotal = () => {
    let total = 0;
    
    const selectedSize = activeOptions.sizes.find((s) => s.id === size);
    if (selectedSize) total += Number(selectedSize.price);

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
    if (!size || !flavor || !filling || !covering || !decoration) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const selectedSize = activeOptions.sizes.find((s) => s.id === size);
    const selectedFlavor = activeOptions.flavors.find((f) => f.id === flavor);
    const selectedFilling = activeOptions.fillings.find((f) => f.id === filling);
    const selectedCovering = activeOptions.coverings.find((c) => c.id === covering);
    const selectedDecoration = activeOptions.decorations.find((d) => d.id === decoration);
    const selectedLayers = activeOptions.layers.find((l) => l.id === layersCount);

    addItem({
      productId: 'custom',
      name: 'Bolo Personalizado',
      image: uploadedImage || '/placeholder.svg',
      customImage: uploadedImage,
      basePrice: calculateTotal(),
      options: {
        size: selectedSize?.name,
        flavor: selectedFlavor?.name,
        filling: selectedFilling?.name,
        covering: selectedCovering?.name,
        decoration: selectedDecoration?.name,
        layers: selectedLayers?.name || '1 Andar',
        notes,
      },
      totalPrice: calculateTotal(),
      quantity: 1,
    });

    toast.success('Bolo adicionado ao carrinho!');
    navigate('/carrinho');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando opções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Personalização Total
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white"
            >
              Monte Seu Bolo{' '}
              <span className="text-white/80">dos Sonhos</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
            >
              Crie o bolo perfeito escolhendo cada detalhe com carinho
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Preview Card - Sticky on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-1 order-1 lg:order-1"
            >
              <div className="lg:sticky lg:top-24">
                <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Preview do Bolo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-gradient-to-b from-background/50 to-muted/30 rounded-xl p-4">
                      <CakePreview
                        size={activeOptions.sizes.find(s => s.id === size)?.name?.toLowerCase().replace(/\s+/g, '-') || ''}
                        flavor={activeOptions.flavors.find(f => f.id === flavor)?.name?.toLowerCase().replace(/\s+/g, '-') || ''}
                        filling={activeOptions.fillings.find(f => f.id === filling)?.name?.toLowerCase().replace(/\s+/g, '-') || ''}
                        covering={activeOptions.coverings.find(c => c.id === covering)?.name?.toLowerCase().replace(/\s+/g, '-') || ''}
                        decoration={activeOptions.decorations.find(d => d.id === decoration)?.name?.toLowerCase().replace(/\s+/g, '-') || ''}
                        layersCount={activeOptions.layers.find(l => l.id === layersCount)?.name?.replace(/\D/g, '') || '1'}
                        onUploadedImageChange={setUploadedImage}
                      />
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      {size && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between"
                        >
                          <span className="text-muted-foreground">Tamanho:</span>
                          <span className="font-medium">{activeOptions.sizes.find(s => s.id === size)?.name}</span>
                        </motion.div>
                      )}
                      {flavor && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between"
                        >
                          <span className="text-muted-foreground">Sabor:</span>
                          <span className="font-medium">{activeOptions.flavors.find(f => f.id === flavor)?.name}</span>
                        </motion.div>
                      )}
                      {filling && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between"
                        >
                          <span className="text-muted-foreground">Recheio:</span>
                          <span className="font-medium">{activeOptions.fillings.find(f => f.id === filling)?.name}</span>
                        </motion.div>
                      )}
                      {covering && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between"
                        >
                          <span className="text-muted-foreground">Cobertura:</span>
                          <span className="font-medium">{activeOptions.coverings.find(c => c.id === covering)?.name}</span>
                        </motion.div>
                      )}
                      {decoration && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between"
                        >
                          <span className="text-muted-foreground">Decoração:</span>
                          <span className="font-medium">{activeOptions.decorations.find(d => d.id === decoration)?.name}</span>
                        </motion.div>
                      )}
                      {layersCount && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between"
                        >
                          <span className="text-muted-foreground">Andares:</span>
                          <span className="font-medium">{activeOptions.layers.find(l => l.id === layersCount)?.name || '1 Andar'}</span>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Form Card */}
            <div className="lg:col-span-2 order-2 lg:order-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8 space-y-8">
                  {/* Size */}
                  {activeOptions.sizes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-4"
                    >
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Cake className="w-5 h-5 text-primary" />
                        Tamanho *
                      </Label>
                      <RadioGroup value={size} onValueChange={setSize}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeOptions.sizes.map((s, index) => (
                            <motion.div
                              key={s.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="relative"
                            >
                              <RadioGroupItem value={s.id} id={s.id} className="peer sr-only" />
                              <Label
                                htmlFor={s.id}
                                className="flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 bg-background/50 backdrop-blur-sm"
                              >
                                <span className="font-semibold">{s.name}</span>
                                {s.description && <span className="text-sm text-muted-foreground">{s.description}</span>}
                                <span className="text-primary font-semibold mt-2">R$ {Number(s.price).toFixed(2)}</span>
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </RadioGroup>
                    </motion.div>
                  )}

                  {/* Flavor */}
                  {activeOptions.flavors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="flavor" className="text-lg font-semibold">Sabor da Massa *</Label>
                      <Select value={flavor} onValueChange={setFlavor}>
                        <SelectTrigger id="flavor" className="bg-background/50 backdrop-blur-sm">
                          <SelectValue placeholder="Selecione o sabor" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeOptions.flavors.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name} {Number(f.price) > 0 && `(+R$ ${Number(f.price).toFixed(2)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}

                  {/* Filling */}
                  {activeOptions.fillings.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="filling" className="text-lg font-semibold">Recheio *</Label>
                      <Select value={filling} onValueChange={setFilling}>
                        <SelectTrigger id="filling" className="bg-background/50 backdrop-blur-sm">
                          <SelectValue placeholder="Selecione o recheio" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeOptions.fillings.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name} {Number(f.price) !== 0 && `(${Number(f.price) > 0 ? '+' : ''}R$ ${Number(f.price).toFixed(2)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}

                  {/* Covering */}
                  {activeOptions.coverings.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="covering" className="text-lg font-semibold">Cobertura *</Label>
                      <Select value={covering} onValueChange={setCovering}>
                        <SelectTrigger id="covering" className="bg-background/50 backdrop-blur-sm">
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
                    </motion.div>
                  )}

                  {/* Decoration */}
                  {activeOptions.decorations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="decoration" className="text-lg font-semibold">Decoração *</Label>
                      <Select value={decoration} onValueChange={setDecoration}>
                        <SelectTrigger id="decoration" className="bg-background/50 backdrop-blur-sm">
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
                    </motion.div>
                  )}

                  {/* Layers */}
                  {activeOptions.layers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                      className="space-y-4"
                    >
                      <Label className="text-lg font-semibold">Número de Andares *</Label>
                      <RadioGroup value={layersCount} onValueChange={setLayersCount}>
                        <div className="grid grid-cols-3 gap-4">
                          {activeOptions.layers.map((l, index) => (
                            <motion.div
                              key={l.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1.3 + index * 0.1 }}
                              className="relative"
                            >
                              <RadioGroupItem value={l.id} id={`layer-${l.id}`} className="peer sr-only" />
                              <Label
                                htmlFor={`layer-${l.id}`}
                                className="flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 bg-background/50 backdrop-blur-sm"
                              >
                                <span className="font-semibold">{l.name}</span>
                                {Number(l.price) > 0 && (
                                  <span className="text-sm text-primary mt-1">+R$ {Number(l.price).toFixed(2)}</span>
                                )}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </RadioGroup>
                    </motion.div>
                  )}

                  {/* Notes */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="notes" className="text-lg font-semibold">Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ex: dedicatória, cores específicas, alergias..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-24 bg-background/50 backdrop-blur-sm"
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total:</span>
                    <span className="text-3xl font-bold gradient-text">R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button 
                    onClick={handleAddToCart} 
                    size="lg" 
                    className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    Adicionar ao Carrinho
                  </Button>
                  <Link to="/catalogo" className="block">
                    <Button variant="outline" className="w-full">
                      Ver Catálogo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonteSeuBolo;
