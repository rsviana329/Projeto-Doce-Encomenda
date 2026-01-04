import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Validates if a URL is a valid public Supabase Storage URL or other permanent URL
 */
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  // Must be a valid HTTP URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  
  // Reject blob URLs
  if (url.startsWith('blob:')) {
    return false;
  }
  
  // Reject base64 data URLs
  if (url.startsWith('data:')) {
    return false;
  }
  
  return true;
}

/**
 * Logs image status for debugging
 */
function logImageStatus(itemName: string, customImage: string | null, productImage: string | null) {
  console.log(`Item "${itemName}" images:`);
  console.log(`  - customImage: ${customImage ? (isValidImageUrl(customImage) ? '✓ Valid URL' : '✗ Invalid') : 'None'}`);
  if (customImage && isValidImageUrl(customImage)) {
    console.log(`    URL: ${customImage}`);
  }
  console.log(`  - productImage: ${productImage ? (isValidImageUrl(productImage) ? '✓ Valid URL' : '✗ Invalid') : 'None'}`);
  if (productImage && isValidImageUrl(productImage)) {
    console.log(`    URL: ${productImage}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData = await req.json();
    
    console.log("=== PROCESSING ORDER FOR WEBHOOK ===");
    console.log(`Customer: ${orderData.customerName} (${orderData.customerPhone})`);
    console.log(`Delivery: ${orderData.deliveryDate}`);
    console.log(`Total: R$ ${orderData.total}`);
    console.log(`Items count: ${orderData.items?.length || 0}`);

    const webhookUrl = 'https://emanoelima23.app.n8n.cloud/webhook-test/doceencomenda12';
    
    // Process and validate items with images
    const validatedItems = (orderData.items || []).map((item: any) => {
      const customImage = item.customImage || null;
      const productImage = item.productImage || null;
      
      // Log image status for each item
      logImageStatus(item.name, customImage, productImage);
      
      // Only include valid URLs in the payload
      const validatedCustomImage = isValidImageUrl(customImage) ? customImage : null;
      const validatedProductImage = isValidImageUrl(productImage) ? productImage : null;
      
      // Warn if an image was filtered out
      if (customImage && !validatedCustomImage) {
        console.warn(`⚠️ Filtered out invalid customImage for "${item.name}": ${customImage?.substring(0, 50)}...`);
      }
      if (productImage && !validatedProductImage) {
        console.warn(`⚠️ Filtered out invalid productImage for "${item.name}": ${productImage?.substring(0, 50)}...`);
      }
      
      return {
        name: item.name,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        options: item.options,
        // Only include valid, permanent URLs
        customImage: validatedCustomImage,
        productImage: validatedProductImage
      };
    });

    // Prepare final payload
    const payload = {
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      deliveryDate: orderData.deliveryDate,
      items: validatedItems,
      total: orderData.total,
      deliveryFee: orderData.deliveryFee,
      notes: orderData.notes,
      timestamp: new Date().toISOString()
    };
    
    console.log("=== SENDING TO WEBHOOK ===");
    console.log(`URL: ${webhookUrl}`);
    console.log(`Payload size: ${JSON.stringify(payload).length} bytes`);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`Webhook response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Webhook error response:", errorText);
      throw new Error(`Webhook failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.text();
    console.log("Webhook response:", responseData);
    console.log("=== ORDER SENT SUCCESSFULLY ===");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order sent successfully',
        itemsProcessed: validatedItems.length,
        imagesIncluded: {
          customImages: validatedItems.filter((i: any) => i.customImage).length,
          productImages: validatedItems.filter((i: any) => i.productImage).length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error("=== ERROR SENDING ORDER ===");
    console.error("Error details:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
