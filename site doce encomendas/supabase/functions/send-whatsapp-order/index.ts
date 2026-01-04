import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  name: string;
  quantity: number;
  totalPrice: number;
  options?: {
    size?: string;
    flavor?: string;
    filling?: string;
    covering?: string;
    decoration?: string;
    layers?: number;
    notes?: string;
  };
}

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  items: OrderItem[];
  total: number;
  notes?: string;
  cakeImageUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Evolution API credentials from environment
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const instanceName = Deno.env.get('EVOLUTION_INSTANCE_NAME');

    console.log('=== EVOLUTION API CONFIG ===');
    console.log('URL configured:', evolutionApiUrl ? 'Yes' : 'No');
    console.log('API Key configured:', evolutionApiKey ? 'Yes' : 'No');
    console.log('Instance Name:', instanceName || 'Not set');

    // Validate credentials
    if (!evolutionApiUrl) {
      throw new Error('EVOLUTION_API_URL não configurada. Configure nas secrets do projeto.');
    }
    if (!evolutionApiKey) {
      throw new Error('EVOLUTION_API_KEY não configurada. Configure nas secrets do projeto.');
    }
    if (!instanceName) {
      throw new Error('EVOLUTION_INSTANCE_NAME não configurada. Configure nas secrets do projeto.');
    }

    // Validate URL is not localhost
    if (evolutionApiUrl.includes('localhost') || evolutionApiUrl.includes('127.0.0.1')) {
      throw new Error('EVOLUTION_API_URL não pode ser localhost. Use uma URL pública (ngrok ou servidor).');
    }

    const orderData: OrderData = await req.json();
    console.log('=== ORDER DATA ===');
    console.log('Customer:', orderData.customerName);
    console.log('Items count:', orderData.items.length);
    console.log('Total:', orderData.total);

    // WhatsApp number to send the order to (Brazil format)
    const destinationNumber = '5599988247734';

    // Format the order message
    const orderMessage = formatOrderMessage(orderData);
    console.log('=== FORMATTED MESSAGE ===');
    console.log(orderMessage);

    // Send text message
    console.log('=== SENDING TEXT MESSAGE ===');
    const textResponse = await sendTextMessage(
      evolutionApiUrl,
      evolutionApiKey,
      instanceName,
      destinationNumber,
      orderMessage
    );
    console.log('Text message response:', JSON.stringify(textResponse));

    // If there's a cake image, send it too
    if (orderData.cakeImageUrl) {
      console.log('=== SENDING IMAGE ===');
      console.log('Image URL:', orderData.cakeImageUrl);
      try {
        const imageResponse = await sendImageMessage(
          evolutionApiUrl,
          evolutionApiKey,
          instanceName,
          destinationNumber,
          orderData.cakeImageUrl,
          `🎂 Imagem do bolo personalizado de ${orderData.customerName}`
        );
        console.log('Image response:', JSON.stringify(imageResponse));
      } catch (imageError) {
        console.error('Error sending image (continuing anyway):', imageError);
        // Don't fail the whole request if image fails
      }
    }

    console.log('=== SUCCESS ===');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Pedido enviado com sucesso para o WhatsApp!' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('=== ERROR ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', errorMessage);
    console.error('Full error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function formatOrderMessage(order: OrderData): string {
  const lines = [
    '🎂 *NOVO PEDIDO DE BOLO* 🎂',
    '',
    '👤 *Cliente:* ' + order.customerName,
    '📱 *Telefone:* ' + order.customerPhone,
  ];

  if (order.customerEmail) {
    lines.push('📧 *Email:* ' + order.customerEmail);
  }

  if (order.deliveryAddress) {
    lines.push('📍 *Endereço:* ' + order.deliveryAddress);
  }

  if (order.deliveryDate) {
    lines.push('📅 *Data de Entrega:* ' + order.deliveryDate);
  }

  lines.push('');
  lines.push('🛒 *ITENS DO PEDIDO:*');
  lines.push('─────────────────');

  order.items.forEach((item, index) => {
    lines.push(`*${index + 1}. ${item.name}* (x${item.quantity})`);
    
    if (item.options) {
      if (item.options.size) lines.push(`   • Tamanho: ${item.options.size}`);
      if (item.options.flavor) lines.push(`   • Sabor: ${item.options.flavor}`);
      if (item.options.filling) lines.push(`   • Recheio: ${item.options.filling}`);
      if (item.options.covering) lines.push(`   • Cobertura: ${item.options.covering}`);
      if (item.options.decoration) lines.push(`   • Decoração: ${item.options.decoration}`);
      if (item.options.layers) lines.push(`   • Andares: ${item.options.layers}`);
      if (item.options.notes) lines.push(`   • Obs: ${item.options.notes}`);
    }
    
    lines.push(`   💰 R$ ${item.totalPrice.toFixed(2)}`);
    lines.push('');
  });

  lines.push('─────────────────');
  lines.push(`💵 *TOTAL: R$ ${order.total.toFixed(2)}*`);

  if (order.notes) {
    lines.push('');
    lines.push('📝 *Observações:*');
    lines.push(order.notes);
  }

  lines.push('');
  lines.push('─────────────────');
  lines.push('✨ Pedido recebido via site');
  lines.push(`🕐 ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);

  return lines.join('\n');
}

async function sendTextMessage(
  baseUrl: string,
  apiKey: string,
  instanceName: string,
  number: string,
  message: string
): Promise<any> {
  // Clean up the base URL (remove trailing slash if present)
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const url = `${cleanBaseUrl}/message/sendText/${instanceName}`;
  
  console.log('Sending text to URL:', url);
  console.log('To number:', number);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
    },
    body: JSON.stringify({
      number: number,
      text: message,
    }),
  });

  const responseText = await response.text();
  console.log('Response status:', response.status);
  console.log('Response body:', responseText);

  if (!response.ok) {
    throw new Error(`Evolution API error: ${response.status} - ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return { raw: responseText };
  }
}

async function sendImageMessage(
  baseUrl: string,
  apiKey: string,
  instanceName: string,
  number: string,
  imageUrl: string,
  caption: string
): Promise<any> {
  // Clean up the base URL (remove trailing slash if present)
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const url = `${cleanBaseUrl}/message/sendMedia/${instanceName}`;
  
  console.log('Sending image to URL:', url);
  console.log('Image URL:', imageUrl);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
    },
    body: JSON.stringify({
      number: number,
      mediatype: 'image',
      media: imageUrl,
      caption: caption,
    }),
  });

  const responseText = await response.text();
  console.log('Image response status:', response.status);
  console.log('Image response body:', responseText);

  if (!response.ok) {
    throw new Error(`Evolution API image error: ${response.status} - ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return { raw: responseText };
  }
}
