import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date>();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };
  const [time, setTime] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrinho');
    }
  }, [items, navigate]);

  const minDate = addDays(new Date(), 2);

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSubmit = () => {
    if (!name || !phone || !date || !deliveryType) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (deliveryType === 'Entrega' && !address) {
      toast.error('Preencha o endereço de entrega');
      return;
    }

    const whatsappData = {
      customer: { name, phone },
      delivery: {
        date: format(date, 'dd/MM/yyyy'),
        time: time || 'A combinar',
        type: deliveryType,
        address: deliveryType === 'Entrega' ? address : 'Retirada no local',
      },
      items,
      total,
      notes,
    };

    localStorage.setItem('doce-encomenda-order-data', JSON.stringify(whatsappData));
    toast.success('Pedido pronto! Redirecionando...');
    setTimeout(() => navigate('/admin/whatsapp-preview'), 1000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link to="/carrinho">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Carrinho
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Finalizar <span className="gradient-text">Pedido</span>
          </h1>
        </div>

        {/* Contact Info */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            <div className="space-y-3">
              <Label>Data de Entrega/Retirada *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd/MM/yyyy') : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < minDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                ⚠️ Pedidos devem ser feitos com pelo menos 2 dias de antecedência
              </p>
            </div>

            {date && availableTimes.length > 0 && (
              <div className="space-y-3">
                <Label htmlFor="time">Horário Preferencial</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Selecione o horário (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="deliveryType">Tipo de Entrega *</Label>
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger id="deliveryType">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrega">Entrega</SelectItem>
                  <SelectItem value="Retirada no Local">Retirada no Local</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {deliveryType === 'Entrega' && (
              <div className="space-y-3">
                <Label htmlFor="address">Endereço de Entrega *</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade..."
                  className="min-h-20"
                />
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="notes">Observações Adicionais</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguma informação adicional sobre o pedido..."
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {index + 1}. {item.name} (x{item.quantity})
                  </span>
                  <span className="font-semibold">
                    R$ {(item.totalPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-3xl font-bold">
                <span>Total:</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={handleSubmit} variant="hero" size="lg" className="w-full">
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar Pedido via WhatsApp
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Ao clicar, você será redirecionado para o WhatsApp com o resumo do pedido.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
