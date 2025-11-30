import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export interface BakerySettings {
  address: string;
  phone: string;
  email: string;
  opening_hours: {
    [key: string]: { open?: string; close?: string; closed?: boolean };
  };
  max_orders_per_day: number;
  max_cakes_per_day: number;
}

export const useBakerySettings = () => {
  return useQuery({
    queryKey: ['bakery-settings'],
    queryFn: async (): Promise<BakerySettings> => {
      return {
        address: 'Rua das Flores, 123 - Centro',
        phone: '(11) 99999-9999',
        email: 'contato@doceencomenda.com',
        opening_hours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '14:00' },
          sunday: { closed: true },
        },
        max_orders_per_day: 10,
        max_cakes_per_day: 3,
      };
    },
  });
};

export const useBlockedDates = () => {
  return useQuery({
    queryKey: ['blocked-dates'],
    queryFn: async (): Promise<Date[]> => {
      // Mock data - sem banco de dados
      return [];
    },
  });
};

export const useAllFutureOrders = () => {
  return useQuery({
    queryKey: ['all-future-orders'],
    queryFn: async (): Promise<Array<{ delivery_date: string; delivery_time: string }>> => {
      // Mock data - sem banco de dados
      return [];
    },
  });
};

export const useScheduledOrders = (date: Date) => {
  return useQuery({
    queryKey: ['scheduled-orders', date.toISOString()],
    queryFn: async (): Promise<string[]> => {
      // Mock data - sem banco de dados
      return [];
    },
  });
};

export const useDayCakesCount = (date: Date) => {
  return useQuery({
    queryKey: ['day-cakes-count', date.toISOString()],
    queryFn: async (): Promise<number> => {
      // Mock data - sem banco de dados
      return 0;
    },
  });
};
