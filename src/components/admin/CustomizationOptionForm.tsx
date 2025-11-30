import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  option_type: z.enum(['size', 'flavor', 'filling', 'covering', 'decoration', 'layer']),
  option_id: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.string(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface CustomizationOptionFormProps {
  option?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const CustomizationOptionForm = ({ option, onSuccess, onCancel }: CustomizationOptionFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      option_type: option?.option_type || 'size',
      option_id: option?.option_id || '',
      name: option?.name || '',
      price: option?.price?.toString() || '0',
      description: option?.description || '',
      is_active: option?.is_active ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // Simular salvamento sem banco de dados
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Sucesso',
        description: option ? 'Opção atualizada com sucesso.' : 'Opção criada com sucesso.',
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving option:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a opção.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="option_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Opção</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="size">Tamanho</SelectItem>
                  <SelectItem value="flavor">Sabor</SelectItem>
                  <SelectItem value="filling">Recheio</SelectItem>
                  <SelectItem value="covering">Cobertura</SelectItem>
                  <SelectItem value="decoration">Decoração</SelectItem>
                  <SelectItem value="layer">Andares</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="option_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID da Opção</FormLabel>
              <FormControl>
                <Input placeholder="Ex: pequeno, chocolate" {...field} disabled={!!option} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Pequeno (15cm)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço Adicional (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: 8-10 porções" {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Opção Ativa</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Define se a opção estará disponível
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : option ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomizationOptionForm;