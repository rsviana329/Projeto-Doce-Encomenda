import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import {
  mockProducts,
  standardSizes,
  standardFlavors,
  standardFillings,
  standardCoverings,
  standardDecorations,
  layers,
} from '@/data/mockData';

const Produto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const product = mockProducts.find((p) => p.id === id);

  const [size, setSize] = useState('');
  const [flavor, setFlavor] = useState(product?.defaultOptions?.flavor || '');
  const [filling, setFilling] = useState(product?.defaultOptions?.filling || '');
  const [covering, setCovering] = useState(product?.defaultOptions?.covering || '');
  const [decoration, setDecoration] = useState(product?.defaultOptions?.decoration || '');
  const [layersCount, setLayersCount] = useState('1');
  const [notes, setNotes] = useState('');

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/catalogo">
          <Button variant="hero">Voltar ao Catálogo</Button>
        </Link>
      </div>
    );
  }

  const calculateTotal = () => {
    if (product.type === 'ready-made') {
      return product.basePrice;
    }

    let total = 0;
    
    const selectedSize = standardSizes.find((s) => s.id === size);
    if (selectedSize) {
      total = selectedSize.price;
    } else {
      total = product.basePrice;
    }

    const selectedFlavor = standardFlavors.find((f) => f.id === flavor);
    if (selectedFlavor) total += selectedFlavor.price;

    const selectedFilling = standardFillings.find((f) => f.id === filling);
    if (selectedFilling) total += selectedFilling.price;

    const selectedCovering = standardCoverings.find((c) => c.id === covering);
    if (selectedCovering) total += selectedCovering.price;

    const selectedDecoration = standardDecorations.find((d) => d.id === decoration);
    if (selectedDecoration) total += selectedDecoration.price;

    const selectedLayers = layers.find((l) => l.id === layersCount);
    if (selectedLayers) total += selectedLayers.price;

    return total;
  };

  const handleAddToCart = () => {
    if (product.type === 'customizable' && !size) {
      toast.error('Selecione um tamanho');
      return;
    }

    const selectedSize = standardSizes.find((s) => s.id === size);
    const selectedFlavor = standardFlavors.find((f) => f.id === flavor);
    const selectedFilling = standardFillings.find((f) => f.id === filling);
    const selectedCovering = standardCoverings.find((c) => c.id === covering);
    const selectedDecoration = standardDecorations.find((d) => d.id === decoration);

    const options = product.type === 'ready-made' ? { notes } : {
      size: selectedSize?.name,
      flavor: selectedFlavor?.name,
      filling: selectedFilling?.name,
      covering: selectedCovering?.name,
      decoration: selectedDecoration?.name,
      layers: parseInt(layersCount),
      notes,
    };

    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.basePrice,
      options,
      totalPrice: calculateTotal(),
      quantity: 1,
    });

    toast.success('Bolo adicionado ao carrinho!');
    navigate('/carrinho');
  };

  const getFilteredOptions = (options: any[], allowedIds?: string[]) => {
    if (!allowedIds) return options;
    return options.filter((opt) => allowedIds.includes(opt.id));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Link to="/catalogo">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Catálogo
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-3xl shadow-card"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.type === 'ready-made' && (
              <Badge className="bg-primary text-primary-foreground">Modelo Pronto</Badge>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>

            {product.type === 'ready-made' ? (
              <>
                <Card className="gradient-card border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary">
                      R$ {product.basePrice.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Sobre este modelo</CardTitle>
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
                    className="min-h-24"
                  />
                </div>

                <Button onClick={handleAddToCart} variant="hero" size="lg" className="w-full">
                  Adicionar ao Carrinho
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">
                  Preço base: <span className="text-primary">R$ {product.basePrice.toFixed(2)}</span>
                </p>

                <Card className="shadow-card border-0">
                  <CardContent className="p-6 space-y-6">
                    {/* Size */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Tamanho *</Label>
                      <RadioGroup value={size} onValueChange={setSize}>
                        <div className="space-y-2">
                          {getFilteredOptions(standardSizes, product.allowedOptions?.sizes).map((s) => (
                            <div key={s.id} className="relative">
                              <RadioGroupItem value={s.id} id={s.id} className="peer sr-only" />
                              <Label
                                htmlFor={s.id}
                                className="flex justify-between items-center p-3 border-2 rounded-xl cursor-pointer transition-smooth hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                              >
                                <div>
                                  <span className="font-semibold">{s.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">{s.description}</span>
                                </div>
                                <span className="text-primary font-semibold">R$ {s.price.toFixed(2)}</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Flavor */}
                    <div className="space-y-3">
                      <Label htmlFor="flavor" className="text-lg font-semibold">Sabor da Massa</Label>
                      <Select value={flavor} onValueChange={setFlavor}>
                        <SelectTrigger id="flavor">
                          <SelectValue placeholder="Selecione o sabor" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilteredOptions(standardFlavors, product.allowedOptions?.flavors).map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name} {f.price > 0 && `(+R$ ${f.price.toFixed(2)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filling */}
                    <div className="space-y-3">
                      <Label htmlFor="filling" className="text-lg font-semibold">Recheio</Label>
                      <Select value={filling} onValueChange={setFilling}>
                        <SelectTrigger id="filling">
                          <SelectValue placeholder="Selecione o recheio" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilteredOptions(standardFillings, product.allowedOptions?.fillings).map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name} {f.price !== 0 && `(${f.price > 0 ? '+' : ''}R$ ${f.price.toFixed(2)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Covering */}
                    <div className="space-y-3">
                      <Label htmlFor="covering" className="text-lg font-semibold">Cobertura</Label>
                      <Select value={covering} onValueChange={setCovering}>
                        <SelectTrigger id="covering">
                          <SelectValue placeholder="Selecione a cobertura" />
                        </SelectTrigger>
                        <SelectContent>
                          {standardCoverings.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} {c.price !== 0 && `(${c.price > 0 ? '+' : ''}R$ ${c.price.toFixed(2)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Decoration */}
                    <div className="space-y-3">
                      <Label htmlFor="decoration" className="text-lg font-semibold">Decoração</Label>
                      <Select value={decoration} onValueChange={setDecoration}>
                        <SelectTrigger id="decoration">
                          <SelectValue placeholder="Selecione a decoração" />
                        </SelectTrigger>
                        <SelectContent>
                          {standardDecorations.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name} {d.price !== 0 && `(${d.price > 0 ? '+' : ''}R$ ${d.price.toFixed(2)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Layers */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Número de Andares</Label>
                      <RadioGroup value={layersCount} onValueChange={setLayersCount}>
                        <div className="grid grid-cols-3 gap-3">
                          {layers.map((l) => (
                            <div key={l.id} className="relative">
                              <RadioGroupItem value={l.id} id={`layer-${l.id}`} className="peer sr-only" />
                              <Label
                                htmlFor={`layer-${l.id}`}
                                className="flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-smooth hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                              >
                                <span className="font-semibold">{l.name}</span>
                                {l.price > 0 && (
                                  <span className="text-sm text-primary">+R$ {l.price.toFixed(2)}</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                      <Label htmlFor="notes" className="text-lg font-semibold">Observações</Label>
                      <Textarea
                        id="notes"
                        placeholder="Ex: dedicatória, cores específicas..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-20"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleAddToCart} variant="hero" size="lg" className="w-full">
                  Adicionar ao Carrinho
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produto;
