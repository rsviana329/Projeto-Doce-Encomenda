import { supabase } from '@/integrations/supabase/client';

export type ImageSource = 'upload' | 'ia';

interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

/**
 * Converte uma string Base64 em Blob
 */
function base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
  // Remove o prefixo data:image/*;base64, se existir
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Gera um nome único para o arquivo
 */
function generateUniqueFileName(extension: string = 'png'): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomId}.${extension}`;
}

/**
 * Detecta o tipo MIME a partir de uma string Base64
 */
function detectMimeType(base64: string): string {
  const match = base64.match(/^data:([^;]+);base64,/);
  return match ? match[1] : 'image/png';
}

/**
 * Extrai a extensão do tipo MIME
 */
function getExtensionFromMimeType(mimeType: string): string {
  const extensionMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return extensionMap[mimeType] || 'png';
}

/**
 * Verifica se uma URL é uma URL pública válida do Supabase
 */
export function isValidSupabaseUrl(url: string): boolean {
  if (!url) return false;
  
  // Verifica se é uma URL do Supabase Storage
  const supabaseStoragePattern = /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\//;
  return supabaseStoragePattern.test(url);
}

/**
 * Verifica se uma string é um Base64 de imagem
 */
export function isBase64Image(str: string): boolean {
  if (!str) return false;
  return str.startsWith('data:image/');
}

/**
 * Verifica se uma URL é um blob URL temporário
 */
export function isBlobUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('blob:');
}

/**
 * Faz upload de um arquivo File para o Supabase Storage
 */
export async function uploadFileToStorage(
  file: File,
  source: ImageSource = 'upload'
): Promise<UploadResult> {
  try {
    const extension = file.name.split('.').pop() || 'png';
    const fileName = generateUniqueFileName(extension);
    const folder = source === 'ia' ? 'ia' : 'uploads';
    const filePath = `${folder}/${fileName}`;

    console.log(`Uploading file to bolos/${filePath}...`);

    const { error: uploadError } = await supabase.storage
      .from('bolos')
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Gera a URL pública
    const { data: urlData } = supabase.storage
      .from('bolos')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Falha ao gerar URL pública' };
    }

    console.log(`Upload successful. Public URL: ${urlData.publicUrl}`);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido no upload' 
    };
  }
}

/**
 * Faz upload de uma imagem Base64 para o Supabase Storage
 */
export async function uploadBase64ToStorage(
  base64: string,
  source: ImageSource = 'ia'
): Promise<UploadResult> {
  try {
    const mimeType = detectMimeType(base64);
    const extension = getExtensionFromMimeType(mimeType);
    const fileName = generateUniqueFileName(extension);
    const folder = source === 'ia' ? 'ia' : 'uploads';
    const filePath = `${folder}/${fileName}`;

    console.log(`Converting Base64 to Blob and uploading to bolos/${filePath}...`);

    // Converte Base64 para Blob
    const blob = base64ToBlob(base64, mimeType);

    const { error: uploadError } = await supabase.storage
      .from('bolos')
      .upload(filePath, blob, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Base64 upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Gera a URL pública
    const { data: urlData } = supabase.storage
      .from('bolos')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Falha ao gerar URL pública' };
    }

    console.log(`Base64 upload successful. Public URL: ${urlData.publicUrl}`);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (error) {
    console.error('Unexpected Base64 upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido no upload' 
    };
  }
}

/**
 * Processa uma imagem (File, Base64 ou URL) e retorna a URL pública do Supabase
 * Esta é a função principal que deve ser usada antes de enviar ao webhook
 */
export async function processImageForWebhook(
  image: string | File | undefined | null
): Promise<string | null> {
  if (!image) {
    return null;
  }

  // Se já é uma URL válida do Supabase, retorna diretamente
  if (typeof image === 'string' && isValidSupabaseUrl(image)) {
    console.log('Image is already a valid Supabase URL:', image);
    return image;
  }

  // Se é um File, faz upload
  if (image instanceof File) {
    console.log('Processing File upload...');
    const result = await uploadFileToStorage(image, 'upload');
    return result.success ? result.publicUrl! : null;
  }

  // Se é uma string Base64, faz upload
  if (typeof image === 'string' && isBase64Image(image)) {
    console.log('Processing Base64 image...');
    const result = await uploadBase64ToStorage(image, 'ia');
    return result.success ? result.publicUrl! : null;
  }

  // Se é um blob URL, não podemos processar (precisa do File original)
  if (typeof image === 'string' && isBlobUrl(image)) {
    console.warn('Blob URL detected - cannot process. Original File required.');
    return null;
  }

  // Se é uma URL externa (não Supabase), pode ser temporária
  // Neste caso, precisamos baixar e re-uploadar
  if (typeof image === 'string' && image.startsWith('http')) {
    console.log('Processing external URL, attempting to download and re-upload...');
    try {
      const response = await fetch(image);
      if (!response.ok) {
        console.error('Failed to fetch external image');
        return null;
      }
      
      const blob = await response.blob();
      const extension = getExtensionFromMimeType(blob.type);
      const fileName = generateUniqueFileName(extension);
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bolos')
        .upload(filePath, blob, {
          contentType: blob.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('External URL upload error:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('bolos')
        .getPublicUrl(filePath);

      console.log(`External URL processed. New public URL: ${urlData?.publicUrl}`);
      return urlData?.publicUrl || null;
    } catch (error) {
      console.error('Error processing external URL:', error);
      return null;
    }
  }

  console.warn('Unknown image format, cannot process:', typeof image);
  return null;
}

/**
 * Valida se uma URL de imagem está acessível
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
