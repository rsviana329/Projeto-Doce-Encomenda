import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, User, Phone, MapPin, FileText, CheckCircle2, AlertCircle, Loader2, Upload } from 'lucide-react';
import { processImageForWebhook, isValidSupabaseUrl, isBase64Image, isBlobUrl } from '@/utils/uploadCakeImage';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { FullscreenReservationCalendar } from '@/components/ui/fullscreen-calendar';
import { useReservations } from '@/hooks/useReservations';
import { generateReceiptPdf } from '@/utils/generateReceiptPdf';
interface FieldState {
  touched: boolean;
  error: string;
}
const Checkout = () => {
  const navigate = useNavigate();
  const {
    items,
    total,
    clearCart
  } = useCart();
  const {
    createReservation,
    loading,
    maxCakesPerDay,
    getReservationCountForDate,
    getRemainingCapacity,
    isDateFullyBooked,
    getAvailableTimesForDate
  } = useReservations();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const DELIVERY_FEE = 10.00;
  const deliveryFee = deliveryType === 'Entrega' ? DELIVERY_FEE : 0;
  const finalTotal = total + deliveryFee;
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({
    name: {
      touched: false,
      error: ''
    },
    phone: {
      touched: false,
      error: ''
    },
    date: {
      touched: false,
      error: ''
    },
    time: {
      touched: false,
      error: ''
    },
    deliveryType: {
      touched: false,
      error: ''
    },
    address: {
      touched: false,
      error: ''
    }
  });
  const validateName = (value: string) => {
    if (!value.trim()) return 'Nome é obrigatório';
    if (value.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres';
    if (value.trim().length > 100) return 'Nome deve ter no máximo 100 caracteres';
    return '';
  };
  const validatePhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return 'Telefone é obrigatório';
    if (numbers.length < 10) return 'Telefone inválido';
    return '';
  };
  const validateDate = (value: Date | undefined) => {
    if (!value) return 'Data é obrigatória';
    return '';
  };
  const validateTime = (value: string) => {
    if (!value) return 'Horário é obrigatório';
    return '';
  };
  const validateDeliveryType = (value: string) => {
    if (!value) return 'Selecione o tipo de entrega';
    return '';
  };
  const validateAddress = (value: string, delivery: string) => {
    if (delivery === 'Entrega' && !value.trim()) return 'Endereço é obrigatório para entrega';
    if (value.trim().length > 500) return 'Endereço deve ter no máximo 500 caracteres';
    return '';
  };
  const handleBlur = (field: string) => {
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(name);
        break;
      case 'phone':
        error = validatePhone(phone);
        break;
      case 'date':
        error = validateDate(date);
        break;
      case 'time':
        error = validateTime(time);
        break;
      case 'deliveryType':
        error = validateDeliveryType(deliveryType);
        break;
      case 'address':
        error = validateAddress(address, deliveryType);
        break;
    }
    setFieldStates(prev => ({
      ...prev,
      [field]: {
        touched: true,
        error
      }
    }));
  };
  const getFieldStatus = (field: string) => {
    const state = fieldStates[field];
    if (!state?.touched) return 'idle';
    if (state.error) return 'error';
    return 'valid';
  };
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
  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrinho');
    }
  }, [items, navigate]);
  const handleSubmit = async () => {
    // Touch all fields to show validation
    const newStates: Record<string, FieldState> = {
      name: {
        touched: true,
        error: validateName(name)
      },
      phone: {
        touched: true,
        error: validatePhone(phone)
      },
      date: {
        touched: true,
        error: validateDate(date)
      },
      time: {
        touched: true,
        error: validateTime(time)
      },
      deliveryType: {
        touched: true,
        error: validateDeliveryType(deliveryType)
      },
      address: {
        touched: true,
        error: validateAddress(address, deliveryType)
      }
    };
    setFieldStates(newStates);
    const hasErrors = Object.values(newStates).some(s => s.error);
    if (hasErrors) {
      toast.error('Corrija os erros no formulário');
      return;
    }
    setIsSubmitting(true);
    try {
      // Create reservation in database first
      const cakeDescription = items.map(item => {
        let desc = `${item.name} (x${item.quantity})`;
        if (item.options) {
          const opts = Object.entries(item.options).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ');
          if (opts) desc += ` - ${opts}`;
        }
        return desc;
      }).join('; ');
      await createReservation(name.trim(), phone, date!, time, cakeDescription);

      // STEP 1: Upload all images to Supabase Storage before proceeding
      console.log('Processing images for upload to Supabase Storage...');
      toast.info('Processando imagens...', { duration: 2000 });

      const processedItems = await Promise.all(
        items.map(async (item) => {
          let processedCustomImage: string | null = null;
          let processedProductImage: string | null = null;

          // Process custom image (user upload or AI generated)
          if (item.customImage) {
            console.log(`Processing custom image for item: ${item.name}`);
            
            // If it's already a valid Supabase URL, use it directly
            if (isValidSupabaseUrl(item.customImage)) {
              processedCustomImage = item.customImage;
              console.log('Custom image already in Supabase Storage');
            } 
            // If it's Base64 (AI generated) or blob URL, upload to storage
            else if (isBase64Image(item.customImage)) {
              console.log('Uploading Base64 image to Supabase Storage...');
              processedCustomImage = await processImageForWebhook(item.customImage);
              if (processedCustomImage) {
                console.log('Base64 image uploaded successfully:', processedCustomImage);
              } else {
                console.error('Failed to upload Base64 image');
              }
            }
            // If it's an external URL (from product-images bucket), keep it
            else if (item.customImage.startsWith('http') && !isBlobUrl(item.customImage)) {
              // Re-upload to bolos bucket for consistency
              processedCustomImage = await processImageForWebhook(item.customImage);
            }
          }

          // Process product image (from catalog)
          if (item.image && item.image !== '/placeholder.svg') {
            // If it's already a valid URL (from product-images bucket), use it
            if (item.image.startsWith('http') && !isBase64Image(item.image) && !isBlobUrl(item.image)) {
              processedProductImage = item.image;
            }
          }

          return {
            name: item.name,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            options: item.options,
            // Only include URLs that are permanent and accessible
            customImage: processedCustomImage || undefined,
            productImage: processedProductImage || undefined,
          };
        })
      );

      // Validate that at least images that existed were processed
      const failedUploads = items.filter((item, index) => {
        const processed = processedItems[index];
        return item.customImage && !processed.customImage;
      });

      if (failedUploads.length > 0) {
        console.warn('Some images failed to upload:', failedUploads.map(i => i.name));
        toast.warning('Algumas imagens não puderam ser processadas, mas o pedido continuará.');
      }

      // STEP 2: Save order to database with processed image URLs
      console.log('Saving order to database...');
      const {
        error: orderError
      } = await supabase.from('orders').insert({
        customer_name: name.trim(),
        customer_phone: phone,
        customer_email: email.trim() || null,
        delivery_address: deliveryType === 'Entrega' ? address.trim() : 'Retirada no local',
        delivery_date: date ? format(date, 'yyyy-MM-dd') : null,
        delivery_time: time || null,
        items: processedItems,
        total: finalTotal,
        notes: notes.trim() || null,
        status: 'pending'
      });
      if (orderError) {
        console.error('Order save error:', orderError);
        throw new Error(`Erro ao salvar pedido: ${orderError.message}`);
      }

      // STEP 3: Prepare order data for webhook with ONLY public URLs
      const orderData = {
        customerName: name.trim(),
        customerPhone: phone,
        customerEmail: email.trim() || undefined,
        deliveryAddress: deliveryType === 'Entrega' ? address.trim() : 'Retirada no local',
        deliveryDate: date ? `${format(date, 'dd/MM/yyyy')} às ${time}` : undefined,
        items: processedItems,
        total: finalTotal,
        deliveryFee: deliveryFee > 0 ? deliveryFee : undefined,
        notes: notes.trim() || undefined
      };

      // STEP 4: Send order data via edge function
      console.log('Sending order to webhook with public image URLs...');
      const {
        data: webhookResult,
        error: webhookError
      } = await supabase.functions.invoke('send-order-webhook', {
        body: orderData
      });
      if (webhookError) {
        console.error('Webhook error:', webhookError);
        // Don't throw here - order is already saved, webhook is secondary
      }
      console.log('Webhook result:', webhookResult);
      toast.success('Pedido enviado com sucesso!');
      clearCart();

      // Prepare order data for preview page and PDF
      const whatsappData = {
        customer: {
          name: name.trim(),
          phone
        },
        delivery: {
          date: format(date!, 'dd/MM/yyyy'),
          time: time || 'A combinar',
          type: deliveryType,
          address: deliveryType === 'Entrega' ? address.trim() : 'Retirada no local'
        },
        items,
        total: finalTotal,
        deliveryFee: deliveryFee > 0 ? deliveryFee : undefined,
        notes: notes.trim()
      };
      // Download receipt PDF automatically
      try {
        await generateReceiptPdf(whatsappData);
        toast.success('Comprovante de envio baixado automaticamente!');
      } catch (pdfError) {
        console.error('Erro ao gerar PDF:', pdfError);
      }
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error sending order:', error);
      toast.error('Erro ao enviar pedido. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const getInputClassName = useCallback((field: string, base: string = '') => {
    const status = getFieldStatus(field);
    return cn(base, 'bg-background/50 transition-all duration-200', status === 'error' && 'border-destructive focus-visible:ring-destructive/50', status === 'valid' && 'border-green-500/50 focus-visible:ring-green-500/50 pr-10');
  }, [fieldStates]);
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="space-y-4">
            <Link to="/carrinho">
              <Button variant="outline" className="gap-2 backdrop-blur-sm bg-background/50">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Carrinho
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <motion.span initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: 0.1
            }} className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                Etapa Final
              </motion.span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Finalizar <span className="gradient-text">Pedido</span>
            </h1>
            <p className="text-muted-foreground max-w-lg">Preencha seus dados para enviar o pedido à Doce Encomenda</p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Contact Info */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }}>
              <Card className="border border-border/50 backdrop-blur-sm bg-card/80 shadow-soft overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Nome Completo *
                      </Label>
                      <div className="relative">
                        <Input id="name" defaultValue="" onChange={e => setName(e.target.value)} onBlur={() => handleBlur('name')} placeholder="Seu nome completo" className={getInputClassName('name')} maxLength={100} />
                        <AnimatePresence>
                          {getFieldStatus('name') === 'valid' && <motion.div initial={{
                          opacity: 0,
                          scale: 0.5
                        }} animate={{
                          opacity: 1,
                          scale: 1
                        }} exit={{
                          opacity: 0,
                          scale: 0.5
                        }} className="absolute right-3 top-1/2 -translate-y-1/2">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {getFieldStatus('name') === 'error' && fieldStates.name?.error && <motion.p initial={{
                        opacity: 0,
                        y: -5
                      }} animate={{
                        opacity: 1,
                        y: 0
                      }} exit={{
                        opacity: 0,
                        y: -5
                      }} className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {fieldStates.name.error}
                          </motion.p>}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        Telefone/WhatsApp *
                      </Label>
                      <div className="relative">
                        <Input id="phone" value={phone} onChange={handlePhoneChange} onBlur={() => handleBlur('phone')} placeholder="(11) 99999-9999" maxLength={15} className={getInputClassName('phone')} />
                        <AnimatePresence>
                          {getFieldStatus('phone') === 'valid' && <motion.div initial={{
                          opacity: 0,
                          scale: 0.5
                        }} animate={{
                          opacity: 1,
                          scale: 1
                        }} exit={{
                          opacity: 0,
                          scale: 0.5
                        }} className="absolute right-3 top-1/2 -translate-y-1/2">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {getFieldStatus('phone') === 'error' && fieldStates.phone?.error && <motion.p initial={{
                        opacity: 0,
                        y: -5
                      }} animate={{
                        opacity: 1,
                        y: 0
                      }} exit={{
                        opacity: 0,
                        y: -5
                      }} className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {fieldStates.phone.error}
                          </motion.p>}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Calendar with Reservations */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      Data e Horário de Entrega/Retirada *
                    </Label>
                    <FullscreenReservationCalendar selectedDate={date} onSelectDate={d => {
                    setDate(d);
                    setTime(''); // Reset time when date changes
                    setFieldStates(prev => ({
                      ...prev,
                      date: {
                        touched: true,
                        error: validateDate(d)
                      },
                      time: {
                        touched: false,
                        error: ''
                      }
                    }));
                  }} selectedTime={time} onSelectTime={t => {
                    setTime(t);
                    setFieldStates(prev => ({
                      ...prev,
                      time: {
                        touched: true,
                        error: validateTime(t)
                      }
                    }));
                  }} allTimes={allTimes} minDaysAhead={2} loading={loading} maxCakesPerDay={maxCakesPerDay} getReservationCountForDate={getReservationCountForDate} getRemainingCapacity={getRemainingCapacity} isDateFullyBooked={isDateFullyBooked} getAvailableTimesForDate={getAvailableTimesForDate} />
                    <AnimatePresence>
                      {getFieldStatus('date') === 'error' && fieldStates.date.error && <motion.p initial={{
                      opacity: 0,
                      y: -5
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} exit={{
                      opacity: 0,
                      y: -5
                    }} className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {fieldStates.date.error}
                        </motion.p>}
                      {getFieldStatus('time') === 'error' && fieldStates.time?.error && <motion.p initial={{
                      opacity: 0,
                      y: -5
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} exit={{
                      opacity: 0,
                      y: -5
                    }} className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {fieldStates.time.error}
                        </motion.p>}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="deliveryType" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      Tipo de Entrega *
                    </Label>
                    <Select value={deliveryType} onValueChange={v => {
                    setDeliveryType(v);
                    setFieldStates(prev => ({
                      ...prev,
                      deliveryType: {
                        touched: true,
                        error: validateDeliveryType(v)
                      }
                    }));
                  }}>
                      <SelectTrigger id="deliveryType" className={getInputClassName('deliveryType')} onBlur={() => handleBlur('deliveryType')}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrega">🚗 Entrega</SelectItem>
                        <SelectItem value="Retirada no Local">🏠 Retirada no Local</SelectItem>
                      </SelectContent>
                    </Select>
                    <AnimatePresence>
                      {getFieldStatus('deliveryType') === 'error' && fieldStates.deliveryType.error && <motion.p initial={{
                      opacity: 0,
                      y: -5
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} exit={{
                      opacity: 0,
                      y: -5
                    }} className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {fieldStates.deliveryType.error}
                        </motion.p>}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {deliveryType === 'Entrega' && <motion.div initial={{
                    opacity: 0,
                    height: 0
                  }} animate={{
                    opacity: 1,
                    height: 'auto'
                  }} exit={{
                    opacity: 0,
                    height: 0
                  }} className="space-y-3">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          Endereço de Entrega *
                        </Label>
                        <Textarea id="address" value={address} onChange={e => setAddress(e.target.value)} onBlur={() => handleBlur('address')} placeholder="Rua, número, bairro, cidade..." className={cn('min-h-20', getInputClassName('address'))} maxLength={500} />
                        <AnimatePresence>
                          {getFieldStatus('address') === 'error' && fieldStates.address.error && <motion.p initial={{
                        opacity: 0,
                        y: -5
                      }} animate={{
                        opacity: 1,
                        y: 0
                      }} exit={{
                        opacity: 0,
                        y: -5
                      }} className="text-xs text-destructive flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {fieldStates.address.error}
                            </motion.p>}
                        </AnimatePresence>
                      </motion.div>}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <Label htmlFor="notes" className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Observações Adicionais
                    </Label>
                    <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Alguma informação adicional sobre o pedido..." className="min-h-20 bg-background/50" maxLength={1000} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }}>
              <Card className="border-0 gradient-primary shadow-glow overflow-hidden">
                <CardHeader className="border-b border-primary-foreground/20">
                  <CardTitle className="text-primary-foreground">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    {items.map((item, index) => <motion.div key={item.id} initial={{
                    opacity: 0,
                    x: -10
                  }} animate={{
                    opacity: 1,
                    x: 0
                  }} transition={{
                    delay: 0.3 + index * 0.05
                  }} className="flex items-center gap-4 text-sm text-primary-foreground/90 py-3 border-b border-primary-foreground/10 last:border-0">
                        {(item.customImage || item.image) && item.image !== '/placeholder.svg' && <img src={item.customImage || item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-primary-foreground/20" />}
                        <div className="flex-1 flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            {item.name} (x{item.quantity})
                          </span>
                          <span className="font-semibold">
                            R$ {(item.totalPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>)}
                  </div>
                  <div className="h-px bg-primary-foreground/20" />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm text-primary-foreground/80">
                      <span>Subtotal:</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <AnimatePresence>
                      {deliveryFee > 0 && <motion.div initial={{
                      opacity: 0,
                      height: 0
                    }} animate={{
                      opacity: 1,
                      height: 'auto'
                    }} exit={{
                      opacity: 0,
                      height: 0
                    }} className="flex justify-between items-center text-sm text-primary-foreground/80">
                          <span>Taxa de Entrega:</span>
                          <span>R$ {deliveryFee.toFixed(2)}</span>
                        </motion.div>}
                    </AnimatePresence>
                    <div className="h-px bg-primary-foreground/20 my-2" />
                    <div className="flex justify-between items-center text-3xl font-bold text-primary-foreground">
                      <span>Total:</span>
                      <span>R$ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} size="lg" disabled={isSubmitting} className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 font-semibold disabled:opacity-70">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando Pedido...
                      </>
                    ) : (
                      'Finalizar Pedido'
                    )}
                  </Button>
                  <p className="text-sm text-center text-primary-foreground/70">Ao clicar, o seu pedido será enviado para a empresa.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>;
};
export default Checkout;