import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CustomizationOption } from '@/hooks/useCustomizationOptions';

interface OptionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option?: CustomizationOption | null;
  defaultType?: string;
  onSubmit: (data: Omit<CustomizationOption, 'id' | 'created_at' | 'updated_at'>) => void;
}

const optionTypeLabels: Record<string, string> = {
  size: 'Tamanho',
  flavor: 'Sabor',
  filling: 'Recheio',
  covering: 'Cobertura',
  decoration: 'Decoração',
  layer: 'Andar',
};

export const OptionFormDialog = ({ open, onOpenChange, option, defaultType, onSubmit }: OptionFormDialogProps) => {
  const [formData, setFormData] = useState({
    option_type: defaultType || 'size',
    name: '',
    description: '',
    price: 0,
    is_active: true,
  });

  useEffect(() => {
    if (option) {
      setFormData({
        option_type: option.option_type,
        name: option.name,
        description: option.description || '',
        price: option.price,
        is_active: option.is_active,
      });
    } else {
      setFormData({
        option_type: defaultType || 'size',
        name: '',
        description: '',
        price: 0,
        is_active: true,
      });
    }
  }, [option, defaultType, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text">
            {option ? 'Editar Opção' : 'Nova Opção'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="option_type">Tipo</Label>
            <Select
              value={formData.option_type}
              onValueChange={(value) => setFormData({ ...formData, option_type: value })}
              disabled={!!option}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(optionTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Ex: 8-10 porções"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço Adicional (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use valores negativos para descontos. Ex: -10 para "- R$ 10,00"
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Opção ativa</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 gradient-primary text-primary-foreground">
              {option ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
