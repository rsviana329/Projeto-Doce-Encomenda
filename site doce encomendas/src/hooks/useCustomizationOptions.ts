import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomizationOption {
  id: string;
  option_type: string;
  name: string;
  description?: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCustomizationOptions = () => {
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customization_options')
        .select('*')
        .order('option_type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setOptions(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar opções',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createOption = async (option: Omit<CustomizationOption, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customization_options')
        .insert([option])
        .select()
        .single();

      if (error) throw error;
      
      setOptions((prev) => [...prev, data]);
      toast({
        title: 'Opção criada',
        description: 'A opção foi cadastrada com sucesso.',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar opção',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateOption = async (id: string, option: Partial<CustomizationOption>) => {
    try {
      const { data, error } = await supabase
        .from('customization_options')
        .update(option)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setOptions((prev) => prev.map((o) => (o.id === id ? data : o)));
      toast({
        title: 'Opção atualizada',
        description: 'A opção foi atualizada com sucesso.',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar opção',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteOption = async (id: string) => {
    try {
      const { error } = await supabase.from('customization_options').delete().eq('id', id);
      if (error) throw error;
      
      setOptions((prev) => prev.filter((o) => o.id !== id));
      toast({
        title: 'Opção excluída',
        description: 'A opção foi removida com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir opção',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getOptionsByType = (type: string) => {
    return options.filter((o) => o.option_type === type);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return { options, loading, createOption, updateOption, deleteOption, getOptionsByType, refetch: fetchOptions };
};
