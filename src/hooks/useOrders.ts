import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address?: string;
  delivery_date?: string;
  delivery_time?: string;
  items: any[];
  total: number;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const parsedOrders: Order[] = (data || []).map((order) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
        customer_email: order.customer_email ?? undefined,
        delivery_address: order.delivery_address ?? undefined,
        delivery_date: order.delivery_date ?? undefined,
        delivery_time: order.delivery_time ?? undefined,
        notes: order.notes ?? undefined,
      }));
      setOrders(parsedOrders);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar pedidos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      setOrders((prev) => prev.map((order) => 
        order.id === id ? { ...order, status, updated_at: new Date().toISOString() } : order
      ));
      toast({
        title: 'Status atualizado',
        description: 'O status do pedido foi atualizado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      
      setOrders((prev) => prev.filter((order) => order.id !== id));
      toast({
        title: 'Pedido excluído',
        description: 'O pedido foi removido com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir pedido',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, updateOrderStatus, deleteOrder, refetch: fetchOrders };
};
