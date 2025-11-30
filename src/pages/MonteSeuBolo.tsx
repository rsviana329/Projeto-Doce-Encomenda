import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cake } from 'lucide-react';
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
  standardSizes,
  standardFlavors,
  standardFillings,
  standardCoverings,
  standardDecorations,
  layers,
} from '@/data/mockData';

const MonteSeuBolo = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [size, setSize] = useState('');
  const [flavor, setFlavor] = useState('');
  const [filling, setFilling] = useState('');
  const [covering, setCovering] = useState('');
  const [decoration, setDecoration] = useState('');
  const [layersCount, setLayersCount] = useState('1');
  const [notes, setNotes] = useState('');

  const calculateTotal = () => {
    let total = 0;
    
    const selectedSize = standardSizes.find((s) => s.id === size);
    if (selectedSize) total += selectedSize.price;

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
    if (!size || !flavor || !filling || !covering || !decoration) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const selectedSize = standardSizes.find((s) => s.id === size);
    const selectedFlavor = standardFlavors.find((f) => f.id === flavor);
    const selectedFilling = standardFillings.find((f) => f.id === filling);
    const selectedCovering = standardCoverings.find((c) => c.id === covering);
    const selectedDecoration = standardDecorations.find((d) => d.id === decoration);

    addItem({
      productId: 'custom',
      name: 'Bolo Personalizado',
      image: '/placeholder.svg',
      basePrice: calculateTotal(),
      options: {
        size: selectedSize?.name,
        flavor: selectedFlavor?.name,
        filling: selectedFilling?.name,
        covering: selectedCovering?.name,
        decoration: selectedDecoration?.name,
        layers: parseInt(layersCount),
        notes,
      },
      totalPrice: calculateTotal(),
      quantity: 1,
    });

    toast.success('Bolo adicionado ao carrinho!');
    navigate('/carrinho');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Cake className="w-4 h-4 mr-2" />
            Personalização Total
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Monte Seu Bolo <span className="gradient-text">dos Sonhos</span>
          </h1>
        </div>

        {/* Form */}
        <Card className="shadow-card border-0">
          <CardContent className="p-8 space-y-8">
            {/* Size */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Tamanho *</Label>
              <RadioGroup value={size} onValueChange={setSize}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {standardSizes.map((s) => (
                    <div key={s.id} className="relative">
                      <RadioGroupItem value={s.id} id={s.id} className="peer sr-only" />
                      <Label
                        htmlFor={s.id}
                        className="flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-smooth hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 shadow-soft"
                      >
                        <span className="font-semibold">{s.name}</span>
                        <span className="text-sm text-muted-foreground">{s.description}</span>
                        <span className="text-primary font-semibold mt-2">R$ {s.price.toFixed(2)}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Flavor */}
            <div className="space-y-3">
              <Label htmlFor="flavor" className="text-lg font-semibold">Sabor da Massa *</Label>
              <Select value={flavor} onValueChange={setFlavor}>
                <SelectTrigger id="flavor">
                  <SelectValue placeholder="Selecione o sabor" />
                </SelectTrigger>
                <SelectContent>
                  {standardFlavors.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} {f.price > 0 && `(+R$ ${f.price.toFixed(2)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filling */}
            <div className="space-y-3">
              <Label htmlFor="filling" className="text-lg font-semibold">Recheio *</Label>
              <Select value={filling} onValueChange={setFilling}>
                <SelectTrigger id="filling">
                  <SelectValue placeholder="Selecione o recheio" />
                </SelectTrigger>
                <SelectContent>
                  {standardFillings.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} {f.price !== 0 && `(${f.price > 0 ? '+' : ''}R$ ${f.price.toFixed(2)})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Covering */}
            <div className="space-y-3">
              <Label htmlFor="covering" className="text-lg font-semibold">Cobertura *</Label>
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
              <Label htmlFor="decoration" className="text-lg font-semibold">Decoração *</Label>
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
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Número de Andares *</Label>
              <RadioGroup value={layersCount} onValueChange={setLayersCount}>
                <div className="grid grid-cols-3 gap-4">
                  {layers.map((l) => (
                    <div key={l.id} className="relative">
                      <RadioGroupItem value={l.id} id={`layer-${l.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`layer-${l.id}`}
                        className="flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-smooth hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 shadow-soft"
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
              <Label htmlFor="notes" className="text-lg font-semibold">Observações Adicionais</Label>
              <Textarea
                id="notes"
                placeholder="Ex: dedicatória, cores específicas, alergias, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-3xl font-bold">
              <span>Total:</span>
              <span className="text-primary">R$ {calculateTotal().toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              * Preços podem variar dependendo da complexidade da decoração
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleAddToCart} variant="hero" size="lg" className="flex-1">
            Adicionar ao Carrinho
          </Button>
          <Link to="/catalogo" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MonteSeuBolo;
