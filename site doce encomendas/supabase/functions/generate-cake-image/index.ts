import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { size, flavor, filling, covering, decoration, layers } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build a detailed prompt for cake image generation
    const sizeDescriptions: Record<string, string> = {
      pequeno: 'small sized',
      medio: 'medium sized',
      grande: 'large sized',
      gigante: 'extra large sized',
    };

    const flavorDescriptions: Record<string, string> = {
      chocolate: 'rich chocolate',
      baunilha: 'vanilla',
      morango: 'strawberry pink',
      laranja: 'orange',
      coco: 'coconut white',
      'red-velvet': 'red velvet',
      limao: 'lemon green',
      mesclado: 'marbled chocolate and vanilla',
      cenoura: 'carrot orange',
    };

    const coveringDescriptions: Record<string, string> = {
      chantilly: 'white whipped cream frosting',
      ganache: 'dark chocolate ganache',
      'pasta-americana': 'smooth white fondant',
      'glace-real': 'royal icing',
      'cobertura-chocolate': 'milk chocolate coating',
      buttercream: 'creamy buttercream',
      'naked-cake': 'naked cake style with exposed layers',
    };

    const decorationDescriptions: Record<string, string> = {
      'flores-naturais': 'decorated with fresh natural flowers on top',
      'flores-acucar': 'decorated with elegant sugar flowers',
      'frutas-frescas': 'topped with fresh colorful fruits',
      'chocolate-raspado': 'covered with chocolate shavings',
      'confetes': 'sprinkled with colorful confetti sprinkles',
      'topo-personalizado': 'with a custom cake topper',
      'tema-infantil': 'with fun children theme decorations, stars and balloons',
      'tema-adulto': 'with elegant adult celebration decorations',
      'sem-decoracao': 'with minimal elegant finish',
    };

    const prompt = `Professional food photography of a beautiful ${sizeDescriptions[size] || 'medium sized'} ${layers || 1}-layer birthday cake. 
The cake is ${flavorDescriptions[flavor] || 'vanilla'} flavored with ${coveringDescriptions[covering] || 'buttercream frosting'}. 
${decoration && decoration !== 'sem-decoracao' ? decorationDescriptions[decoration] : 'Simple elegant design.'}
Studio lighting, white background, high detail, appetizing, professional bakery quality, 4K, photorealistic.`;

    console.log('Generating cake image with prompt:', prompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes para geração de imagem.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('Falha ao gerar imagem');
    }

    console.log('Cake image generated successfully');

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating cake image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
