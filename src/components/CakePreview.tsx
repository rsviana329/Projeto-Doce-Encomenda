import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Check, Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { uploadFileToStorage, uploadBase64ToStorage } from '@/utils/uploadCakeImage';

// Sparkle burst effect component
const SparklesBurst = ({ show }: { show: boolean }) => {
  const sparkles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 20,
      distance: 80 + Math.random() * 60,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 0.3,
      color: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98'][Math.floor(Math.random() * 5)],
    }));
  }, []);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => {
        const rad = (sparkle.angle * Math.PI) / 180;
        const x = Math.cos(rad) * sparkle.distance;
        const y = Math.sin(rad) * sparkle.distance;

        return (
          <motion.div
            key={sparkle.id}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              backgroundColor: sparkle.color,
              boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: [0, x * 0.5, x],
              y: [0, y * 0.5, y],
              opacity: [1, 1, 0],
              scale: [0, 1.5, 0.5],
            }}
            transition={{
              duration: 0.8,
              delay: sparkle.delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
      
      {/* Central glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 2.5], opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
};

// Change indicator component
const ChangeIndicator = ({ show, label, color }: { show: boolean; label: string; color: string }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.8 }}
      className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg z-50"
      style={{ 
        background: `linear-gradient(135deg, ${color}ee, ${color}cc)`,
        boxShadow: `0 4px 15px ${color}66`
      }}
    >
      <Check className="w-3 h-3 text-white" />
      <span className="text-xs font-medium text-white whitespace-nowrap">{label}</span>
    </motion.div>
  );
};

// Ripple effect component
const RippleEffect = ({ show, color }: { show: boolean; color: string }) => {
  if (!show) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-lg border-2"
          style={{ borderColor: color }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.5 + i * 0.2, opacity: 0 }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
};

// Shimmer overlay component
const ShimmerOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        }}
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

interface CakePreviewProps {
  size: string;
  flavor: string;
  filling: string;
  covering: string;
  decoration: string;
  layersCount: string;
  onUploadedImageChange?: (imageUrl: string | null) => void;
}

// Normaliza nome para slug: remove acentos, converte para minúsculas, substitui espaços por hífens
const normalizeToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
    .replace(/\s+/g, '-') // espaços para hífens
    .replace(/-+/g, '-') // múltiplos hífens para um só
    .trim();
};

// Mapeamento de nomes do banco para slugs do preview
const flavorNameMap: Record<string, string> = {
  'chocolate': 'chocolate',
  'baunilha': 'baunilha',
  'morango': 'morango',
  'laranja': 'laranja',
  'coco': 'coco',
  'red-velvet': 'red-velvet',
  'limao': 'limao',
  'mesclado': 'mesclado',
  'cenoura': 'cenoura',
};

const fillingNameMap: Record<string, string> = {
  'brigadeiro': 'brigadeiro',
  'doce-de-leite': 'doce-leite',
  'ganache': 'ganache',
  'creme-de-morango': 'creme-morango',
  'mousse-de-chocolate': 'mousse-chocolate',
  'mousse-de-maracuja': 'mousse-maracuja',
  'creme-de-avela-nutella': 'creme-avela',
  'frutas-vermelhas': 'frutas-vermelhas',
  'sem-recheio': 'sem-recheio',
  'prestigio': 'brigadeiro', // fallback visual
};

const coveringNameMap: Record<string, string> = {
  'chantilly': 'chantilly',
  'ganache': 'ganache',
  'pasta-americana': 'pasta-americana',
  'glace-real': 'glace-real',
  'cobertura-de-chocolate': 'cobertura-chocolate',
  'buttercream': 'buttercream',
  'naked-cake-sem-cobertura': 'naked-cake',
};

const sizeNameMap: Record<string, string> = {
  'pequeno-15cm': 'pequeno',
  'medio-20cm': 'medio',
  'grande-25cm': 'grande',
  'gigante-30cm': 'gigante',
};

const decorationNameMap: Record<string, string> = {
  'flores-naturais': 'flores-naturais',
  'flores-de-acucar': 'flores-acucar',
  'frutas-frescas': 'frutas-frescas',
  'chocolate-raspado': 'chocolate-raspado',
  'confetes': 'confetes',
  'topo-personalizado': 'topo-personalizado',
  'tema-infantil': 'tema-infantil',
  'tema-adulto': 'tema-adulto',
  'simplesminimalista': 'sem-decoracao',
};

const flavorColors: Record<string, string> = {
  chocolate: '#5D4037',
  baunilha: '#F5E6D3',
  morango: '#FFCDD2',
  laranja: '#FFE0B2',
  coco: '#FAFAFA',
  'red-velvet': '#C62828',
  limao: '#E8F5E9',
  mesclado: '#8D6E63',
  cenoura: '#FFAB91',
  '': '#E8D4C4',
};

const fillingColors: Record<string, string> = {
  brigadeiro: '#3E2723',
  'doce-leite': '#D4A574',
  ganache: '#2C1810',
  'creme-morango': '#F8BBD9',
  'mousse-chocolate': '#4E342E',
  'mousse-maracuja': '#FFF59D',
  'creme-avela': '#795548',
  'frutas-vermelhas': '#E57373',
  'sem-recheio': 'transparent',
  '': '#D4A574',
};

const coveringColors: Record<string, string> = {
  chantilly: '#FFFDF7',
  ganache: '#2C1810',
  'pasta-americana': '#FFFFFF',
  'glace-real': '#F5F5F5',
  'cobertura-chocolate': '#3E2723',
  buttercream: '#FFF8E1',
  'naked-cake': 'transparent',
  '': '#FFFDF7',
};

const sizeScales: Record<string, number> = {
  pequeno: 0.7,
  medio: 0.85,
  grande: 1,
  gigante: 1.15,
  '': 0.85,
};

const DecorationElement = ({ decoration }: { decoration: string }) => {
  switch (decoration) {
    case 'flores-naturais':
    case 'flores-acucar':
      return (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="w-6 h-6 rounded-full"
              style={{
                background: i === 1 ? '#F48FB1' : '#CE93D8',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>
      );
    case 'frutas-frescas':
      return (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 rounded-full bg-red-500"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-5 h-5 rounded-full bg-yellow-400"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-4 h-4 rounded-full bg-orange-500"
          />
        </div>
      );
    case 'chocolate-raspado':
      return (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-2 h-3 bg-amber-900 rounded-sm rotate-12"
            />
          ))}
        </div>
      );
    case 'confetes':
      return (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
          {['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'].map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              className="w-2 h-2 rounded-full"
              style={{ background: color }}
            />
          ))}
        </div>
      );
    case 'topo-personalizado':
      return (
        <motion.div
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-12 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">TOP</span>
          </div>
          <div className="w-1 h-4 bg-amber-700 mx-auto" />
        </motion.div>
      );
    case 'tema-infantil':
      return (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl"
          >
            ⭐
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl"
          >
            🎈
          </motion.div>
        </div>
      );
    case 'tema-adulto':
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl"
        >
          🎂
        </motion.div>
      );
    default:
      return null;
  }
};

export const CakePreview = ({
  size,
  flavor,
  filling,
  covering,
  decoration,
  layersCount,
  onUploadedImageChange,
}: CakePreviewProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [activeChange, setActiveChange] = useState<{ label: string; color: string } | null>(null);
  const [showShimmer, setShowShimmer] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [rippleColor, setRippleColor] = useState('#F8BBD9');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track previous values to detect changes
  const prevValues = useRef({ size, flavor, filling, covering, decoration, layersCount });

  const categoryLabels: Record<string, string> = {
    size: 'Tamanho',
    flavor: 'Massa',
    filling: 'Recheio',
    covering: 'Cobertura',
    decoration: 'Decoração',
    layersCount: 'Andares'
  };

  const optionLabels: Record<string, Record<string, string>> = {
    size: { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande', gigante: 'Gigante' },
    flavor: { 
      chocolate: 'Chocolate', baunilha: 'Baunilha', morango: 'Morango', 
      laranja: 'Laranja', coco: 'Coco', 'red-velvet': 'Red Velvet',
      limao: 'Limão', mesclado: 'Mesclado', cenoura: 'Cenoura'
    },
    filling: {
      brigadeiro: 'Brigadeiro', 'doce-leite': 'Doce de Leite', ganache: 'Ganache',
      'creme-morango': 'Creme de Morango', 'mousse-chocolate': 'Mousse de Chocolate',
      'mousse-maracuja': 'Mousse de Maracujá', 'creme-avela': 'Creme de Avelã',
      'frutas-vermelhas': 'Frutas Vermelhas', 'sem-recheio': 'Sem Recheio'
    },
    covering: {
      chantilly: 'Chantilly', ganache: 'Ganache', 'pasta-americana': 'Pasta Americana',
      'glace-real': 'Glacê Real', 'cobertura-chocolate': 'Chocolate', 
      buttercream: 'Buttercream', 'naked-cake': 'Naked Cake'
    },
    decoration: {
      'flores-naturais': 'Flores Naturais', 'flores-acucar': 'Flores de Açúcar',
      'frutas-frescas': 'Frutas Frescas', 'chocolate-raspado': 'Chocolate Raspado',
      'confetes': 'Confetes', 'topo-personalizado': 'Topo Personalizado',
      'tema-infantil': 'Tema Infantil', 'tema-adulto': 'Tema Adulto',
      'sem-decoracao': 'Sem Decoração'
    }
  };

  const optionColors: Record<string, string> = {
    size: '#9C27B0',
    flavor: '#E91E63',
    filling: '#FF9800',
    covering: '#2196F3',
    decoration: '#4CAF50',
    layersCount: '#673AB7'
  };

  useEffect(() => {
    const prev = prevValues.current;
    let changedOption: string | null = null;
    let changedValue: string | null = null;

    if (size !== prev.size && size) {
      changedOption = 'size';
      changedValue = size;
    } else if (flavor !== prev.flavor && flavor) {
      changedOption = 'flavor';
      changedValue = flavor;
    } else if (filling !== prev.filling && filling) {
      changedOption = 'filling';
      changedValue = filling;
    } else if (covering !== prev.covering && covering) {
      changedOption = 'covering';
      changedValue = covering;
    } else if (decoration !== prev.decoration && decoration) {
      changedOption = 'decoration';
      changedValue = decoration;
    } else if (layersCount !== prev.layersCount && layersCount) {
      changedOption = 'layersCount';
      changedValue = `${layersCount} camada${parseInt(layersCount) > 1 ? 's' : ''}`;
    }

    if (changedOption && changedValue) {
      const categoryName = categoryLabels[changedOption] || changedOption;
      const valueName = changedOption === 'layersCount' 
        ? changedValue 
        : optionLabels[changedOption]?.[changedValue] || changedValue;
      const label = `${categoryName}: ${valueName}`;
      const color = optionColors[changedOption];
      
      setActiveChange({ label, color });
      setShowShimmer(true);
      setShowRipple(true);
      setRippleColor(color);

      setTimeout(() => setActiveChange(null), 1500);
      setTimeout(() => setShowShimmer(false), 600);
      setTimeout(() => setShowRipple(false), 700);
    }

    prevValues.current = { size, flavor, filling, covering, decoration, layersCount };
  }, [size, flavor, filling, covering, decoration, layersCount]);

  // Normaliza e mapeia os valores recebidos para os slugs do preview
  const normalizedSize = sizeNameMap[normalizeToSlug(size)] || size;
  const normalizedFlavor = flavorNameMap[normalizeToSlug(flavor)] || flavor;
  const normalizedFilling = fillingNameMap[normalizeToSlug(filling)] || filling;
  const normalizedCovering = coveringNameMap[normalizeToSlug(covering)] || covering;
  const normalizedDecoration = decorationNameMap[normalizeToSlug(decoration)] || decoration;

  const layers = parseInt(layersCount) || 1;
  const scale = sizeScales[normalizedSize] || 0.85;
  const cakeColor = flavorColors[normalizedFlavor] || flavorColors[''];
  const fillingColor = fillingColors[normalizedFilling] || fillingColors[''];
  const coveringColor = coveringColors[normalizedCovering] || coveringColors[''];
  const isNakedCake = normalizedCovering === 'naked-cake';

  const layerWidths = [120, 100, 80];
  const layerHeights = [50, 45, 40];

  const hasSelections = size || flavor || filling || covering || decoration;

  const handleGenerateImage = async () => {
    if (!hasSelections) {
      toast.error('Selecione pelo menos uma opção para gerar a imagem');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-cake-image', {
        body: {
          size: size || 'medio',
          flavor: flavor || 'baunilha',
          filling: filling || 'brigadeiro',
          covering: covering || 'chantilly',
          decoration: decoration || 'sem-decoracao',
          layers: layers,
        },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        // Se a imagem retornada é Base64, faz upload para o Supabase Storage
        let finalImageUrl = data.imageUrl;
        
        if (data.imageUrl.startsWith('data:')) {
          console.log('AI returned Base64 image, uploading to Supabase Storage...');
          toast.info('Salvando imagem gerada...', { duration: 2000 });
          
          const uploadResult = await uploadBase64ToStorage(data.imageUrl, 'ia');
          
          if (uploadResult.success && uploadResult.publicUrl) {
            finalImageUrl = uploadResult.publicUrl;
            console.log('AI image uploaded to Supabase:', finalImageUrl);
          } else {
            console.error('Failed to upload AI image:', uploadResult.error);
            // Fallback: still use the base64 for display, but it won't be sent to webhook
            toast.warning('Imagem gerada, mas pode não aparecer no pedido final.');
          }
        }
        
        setGeneratedImage(finalImageUrl);
        setUploadedImage(null);
        onUploadedImageChange?.(finalImageUrl);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 1000);
        toast.success('Imagem gerada com sucesso!');
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar imagem');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Use the centralized upload utility - uploads to 'bolos' bucket
      const result = await uploadFileToStorage(file, 'upload');

      if (!result.success || !result.publicUrl) {
        throw new Error(result.error || 'Falha no upload');
      }

      setUploadedImage(result.publicUrl);
      setGeneratedImage(null);
      onUploadedImageChange?.(result.publicUrl);
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImage(null);
    onUploadedImageChange?.(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Uploaded Image Display */}
      <AnimatePresence mode="wait">
        {uploadedImage ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-xs relative"
          >
            <SparklesBurst show={showSparkles} />
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Imagem do bolo enviada pelo usuário"
                className="w-full h-auto rounded-xl shadow-lg object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={handleRemoveUploadedImage}
                className="absolute top-2 right-2 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Imagem enviada por você
            </p>
          </motion.div>
        ) : generatedImage ? (
          <motion.div
            key="generated"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-xs relative"
          >
            <SparklesBurst show={showSparkles} />
            <img
              src={generatedImage}
              alt="Bolo personalizado gerado por IA"
              className="w-full h-auto rounded-xl shadow-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setGeneratedImage(null);
                onUploadedImageChange?.(null);
              }}
              className="mt-2 w-full text-muted-foreground"
            >
              Ver preview padrão
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            className="relative flex flex-col items-center justify-end h-64"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: scale }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Change indicator */}
            <AnimatePresence>
              {activeChange && (
                <ChangeIndicator 
                  show={true} 
                  label={activeChange.label} 
                  color={activeChange.color} 
                />
              )}
            </AnimatePresence>

            {/* Cake Plate */}
            <motion.div
              className="absolute bottom-0 w-40 h-3 rounded-full bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
            />

            {/* Cake Layers */}
            <div className="relative flex flex-col-reverse items-center mb-2">
              <AnimatePresence mode="popLayout">
                {[...Array(layers)].map((_, index) => {
                  // Andar 1 = base (maior), andar 2 = meio, andar 3 = topo (menor)
                  const layerNumber = index + 1; // 1, 2, 3...
                  const width = layerWidths[index] || 70;
                  const height = layerHeights[index] || 35;
                  const isTopLayer = index === layers - 1;

                  return (
                    <motion.div
                      key={`layer-${layerNumber}`}
                      initial={{ opacity: 0, y: 50, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.5 }}
                      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
                      className="relative"
                      style={{ zIndex: layers - index }}
                    >
                      {/* Filling layer (between cake layers) */}
                      {index < layers - 1 && filling !== 'sem-recheio' && (
                        <motion.div
                          className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ 
                            scaleX: 1,
                            width: width - 10,
                            background: fillingColor,
                          }}
                          transition={{ 
                            scaleX: { delay: index * 0.15 + 0.1 },
                            background: { duration: 0.4 },
                            width: { duration: 0.3 }
                          }}
                          style={{
                            height: 6,
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                          }}
                        />
                      )}

                      {/* Main cake layer */}
                      <motion.div
                        className="rounded-lg relative overflow-hidden"
                        initial={false}
                        animate={{
                          width,
                          height,
                          background: isNakedCake
                            ? `linear-gradient(180deg, ${cakeColor} 0%, ${cakeColor}dd 100%)`
                            : `linear-gradient(180deg, ${coveringColor} 0%, ${coveringColor}ee 50%, ${coveringColor}dd 100%)`,
                          borderWidth: isNakedCake ? 3 : 0,
                          borderColor: isNakedCake ? cakeColor : 'transparent',
                        }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{
                          boxShadow: `
                            0 4px 6px rgba(0,0,0,0.1),
                            inset 0 2px 4px rgba(255,255,255,0.3),
                            inset 0 -2px 4px rgba(0,0,0,0.1)
                          `,
                          borderStyle: 'solid',
                        }}
                      >
                        {/* Naked cake side layers visible */}
                        {isNakedCake && (
                          <>
                            <motion.div
                              className="absolute left-0 right-0 h-1/3 top-0"
                              initial={false}
                              animate={{ background: cakeColor }}
                              transition={{ duration: 0.4 }}
                            />
                            {filling !== 'sem-recheio' && (
                              <motion.div
                                className="absolute left-0 right-0 h-1 top-1/3"
                                initial={false}
                                animate={{ background: fillingColor }}
                                transition={{ duration: 0.4 }}
                              />
                            )}
                          </>
                        )}

                        {/* Decorative texture */}
                        {!isNakedCake && (
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              background: `repeating-linear-gradient(
                                0deg,
                                transparent,
                                transparent 8px,
                                rgba(255,255,255,0.3) 8px,
                                rgba(255,255,255,0.3) 10px
                              )`,
                            }}
                          />
                        )}

                        {/* Shimmer effect on change */}
                        <AnimatePresence>
                          <ShimmerOverlay show={showShimmer} />
                        </AnimatePresence>

                        {/* Ripple effect on change */}
                        <AnimatePresence>
                          <RippleEffect show={showRipple} color={rippleColor} />
                        </AnimatePresence>
                      </motion.div>

                      {/* Decoration on top layer */}
                      {isTopLayer && <DecorationElement decoration={normalizedDecoration} />}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Hint text when no selections */}
            {!hasSelections && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="absolute bottom-8 text-muted-foreground text-xs text-center px-4"
              >
                Personalize seu bolo acima
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
        {/* Upload Image Button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2 flex-1"
          variant="secondary"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Enviar foto
            </>
          )}
        </Button>

        {/* Generate AI Image Button */}
        <Button
          onClick={handleGenerateImage}
          disabled={isGenerating || !hasSelections}
          className="gap-2 flex-1"
          variant="outline"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Gerar com IA
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
