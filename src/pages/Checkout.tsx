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
<<<<<<< HEAD
=======
import { useBakerySettings, useBlockedDates, useAllFutureOrders } from '@/hooks/useBakerySettings';
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total } = useCart();
<<<<<<< HEAD
=======
  const { data: settings } = useBakerySettings();
  const { data: blockedDates = [] } = useBlockedDates();
  const { data: allFutureOrders = [] } = useAllFutureOrders();
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b

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

<<<<<<< HEAD
=======
  const getDayCakesCount = (checkDate: Date) => {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    return allFutureOrders.filter(order => order.delivery_date === dateStr).length;
  };

  const getScheduledOrders = (checkDate: Date) => {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    return allFutureOrders
      .filter(order => order.delivery_date === dateStr)
      .map(order => order.delivery_time);
  };

  const dayCakesCount = date ? getDayCakesCount(date) : 0;
  const scheduledOrders = date ? getScheduledOrders(date) : [];

>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrinho');
    }
  }, [items, navigate]);

  const minDate = addDays(new Date(), 2);

<<<<<<< HEAD
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSubmit = () => {
=======
  const isDateBlocked = (checkDate: Date) => {
    // Verifica se a data está na lista de bloqueadas
    const isManuallyBlocked = blockedDates.some(
      (blocked) => format(blocked, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd')
    );
    
    // Verifica se o dia já atingiu o limite de bolos (só bloqueia se settings existir)
    if (!settings) return isManuallyBlocked;
    
    const count = getDayCakesCount(checkDate);
    const isDayFull = count >= settings.max_cakes_per_day;
    
    return isManuallyBlocked || isDayFull;
  };

  const isDayFull = settings ? dayCakesCount >= settings.max_cakes_per_day : false;

  const getAvailableTimes = () => {
    if (!date || !settings) return [];

    // Mapeamento de dias em inglês para os settings
    const dayMapping: { [key: string]: string } = {
      'domingo': 'sunday',
      'segunda-feira': 'monday',
      'terça-feira': 'tuesday',
      'quarta-feira': 'wednesday',
      'quinta-feira': 'thursday',
      'sexta-feira': 'friday',
      'sábado': 'saturday'
    };
    
    const dayNamePt = format(date, 'EEEE', { locale: ptBR }).toLowerCase();
    const dayName = dayMapping[dayNamePt] || 'monday';
    const daySchedule = settings.opening_hours[dayName];

    if (!daySchedule || daySchedule.closed) return [];

    const times: string[] = [];
    const [openHour] = daySchedule.open!.split(':').map(Number);
    const [closeHour] = daySchedule.close!.split(':').map(Number);

    for (let hour = openHour; hour < closeHour; hour++) {
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      if (!scheduledOrders.includes(timeStr)) {
        times.push(timeStr);
      }
    }

    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleSubmit = async () => {
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
    if (!name || !phone || !date || !deliveryType) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (deliveryType === 'Entrega' && !address) {
      toast.error('Preencha o endereço de entrega');
      return;
    }

<<<<<<< HEAD
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
=======
    if (isDayFull) {
      toast.error('Este dia já atingiu o limite máximo de 3 bolos. Por favor, selecione outra data.');
      return;
    }

    if (time && scheduledOrders.includes(time)) {
      toast.error('Este horário já está ocupado. Por favor, selecione outro horário ou deixe em branco para combinar depois.');
      return;
    }

    try {
      // Preparar dados para WhatsApp (sem salvar no banco)
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
      toast.success('Pedido preparado com sucesso! Redirecionando...');
      setTimeout(() => navigate('/admin/whatsapp-preview'), 1000);
    } catch (error) {
      console.error('Error preparing order:', error);
      toast.error('Erro ao preparar o pedido. Tente novamente.');
    }
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
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
<<<<<<< HEAD
                    disabled={(date) => date < minDate}
=======
                    disabled={(date) => date < minDate || isDateBlocked(date)}
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                ⚠️ Pedidos devem ser feitos com pelo menos 2 dias de antecedência
              </p>
            </div>

<<<<<<< HEAD
            {date && availableTimes.length > 0 && (
=======
            {date && isDayFull && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Este dia já atingiu o limite máximo de 3 bolos. Por favor, selecione outra data.
                </p>
              </div>
            )}

            {date && !isDayFull && availableTimes.length > 0 && (
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
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
<<<<<<< HEAD
=======
                <p className="text-sm text-muted-foreground">
                  {dayCakesCount > 0 && `${dayCakesCount} de ${settings?.max_cakes_per_day} bolos agendados para este dia`}
                </p>
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
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
