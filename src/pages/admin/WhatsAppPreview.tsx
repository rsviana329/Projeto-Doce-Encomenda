import { useState, useEffect } from 'react';
import { MessageSquare, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD

const WhatsAppPreview = () => {
=======
import { useBakerySettings } from '@/hooks/useBakerySettings';

const WhatsAppPreview = () => {
  const { data: settings } = useBakerySettings();
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
  const [orderData, setOrderData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('doce-encomenda-order-data');
    if (data) {
      setOrderData(JSON.parse(data));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Nenhum pedido encontrado</p>
      </div>
    );
  }

  const formatMessage = () => {
    let message = `🍰 *Novo Pedido - Doce Encomenda*\n\n`;
    message += `*Cliente:* ${orderData.customer.name}\n`;
    message += `*Telefone:* ${orderData.customer.phone}\n`;
    message += `*Data:* ${orderData.delivery.date}\n`;
    message += `*Hora:* ${orderData.delivery.time}\n`;
    message += `*Entrega/Retirada:* ${orderData.delivery.address}\n\n`;
    message += `*Itens do Pedido:*\n\n`;

    orderData.items.forEach((item: any, index: number) => {
      message += `${index + 1}. *${item.name}*\n`;
      if (item.options) {
        if (item.options.size) message += `   📏 Tamanho: ${item.options.size}\n`;
        if (item.options.flavor) message += `   🎂 Sabor da Massa: ${item.options.flavor}\n`;
        if (item.options.filling) message += `   🍫 Recheio: ${item.options.filling}\n`;
        if (item.options.covering) message += `   🎨 Cobertura: ${item.options.covering}\n`;
        if (item.options.decoration) message += `   ✨ Decoração: ${item.options.decoration}\n`;
        if (item.options.layers) message += `   🎂 Andares: ${item.options.layers}\n`;
        if (item.options.theme) message += `   🎪 Tema: ${item.options.theme}\n`;
        if (item.options.color) message += `   🎨 Cor: ${item.options.color}\n`;
        if (item.options.notes) message += `   📝 Obs: ${item.options.notes}\n`;
      }
      message += `   💰 Valor: R$ ${(item.totalPrice * item.quantity).toFixed(2)}\n`;
      message += `   📦 Quantidade: ${item.quantity}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━\n`;
    message += `*💵 TOTAL: R$ ${orderData.total.toFixed(2)}*\n`;
    message += `━━━━━━━━━━━━━━━━━\n\n`;

    if (orderData.notes) {
      message += `📝 *Observações Gerais:*\n${orderData.notes}\n\n`;
    }

    message += `✅ Aguardando confirmação!`;

    return message;
  };

<<<<<<< HEAD
  const whatsappNumber = '5511999999999';
=======
  const whatsappNumber = settings?.phone.replace(/\D/g, '') || '';
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
  const message = formatMessage();
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Preview WhatsApp
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">
            Visualizar Mensagem do <span className="gradient-text">WhatsApp</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Veja como ficaria a mensagem quando o cliente enviar o pedido
          </p>
        </div>

        {/* Message Preview */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Mensagem de Encomenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-6 rounded-2xl font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
              {message}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleCopy} variant="outline" size="lg" className="flex-1">
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copiar Mensagem
                  </>
                )}
              </Button>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="hero" size="lg" className="w-full">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Abrir no WhatsApp
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Cart Summary */}
        <Card className="gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Informações do Carrinho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderData.items.map((item: any) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-border/40 last:border-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shadow-soft"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                  {item.options && (
                    <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                      {item.options.size && <p>Tamanho: {item.options.size}</p>}
                      {item.options.flavor && <p>Sabor: {item.options.flavor}</p>}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    R$ {(item.totalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 flex justify-between items-center text-2xl font-bold">
              <span>Total:</span>
              <span className="text-primary">R$ {orderData.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
