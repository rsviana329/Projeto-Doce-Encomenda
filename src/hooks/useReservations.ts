import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';

// Configuration: Maximum cakes per day
const MAX_CAKES_PER_DAY = 5;

export interface Reservation {
  id: string;
  customer_name: string;
  reservation_date: string;
  reservation_time: string;
  status: string;
}

export interface DayReservations {
  [date: string]: string[]; // date -> array of reserved times
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dayReservations, setDayReservations] = useState<DayReservations>({});
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(addMonths(new Date(), 3)); // Next 3 months

      const { data, error } = await supabase
        .from('cake_reservations')
        .select('id, customer_name, reservation_date, reservation_time, status')
        .gte('reservation_date', format(startDate, 'yyyy-MM-dd'))
        .lte('reservation_date', format(endDate, 'yyyy-MM-dd'))
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;

      setReservations(data || []);

      // Group by date
      const grouped: DayReservations = {};
      (data || []).forEach((r) => {
        const dateKey = r.reservation_date;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(r.reservation_time);
      });
      setDayReservations(grouped);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getReservedTimesForDate = (date: Date): string[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dayReservations[dateKey] || [];
  };

  const getAvailableTimesForDate = (date: Date, allTimes: string[]): string[] => {
    const reserved = getReservedTimesForDate(date);
    const totalReservations = reserved.length;
    
    // If max capacity reached for the day, no times are available
    if (totalReservations >= MAX_CAKES_PER_DAY) {
      return [];
    }
    
    // Otherwise, return times that haven't been reserved yet
    return allTimes.filter((time) => !reserved.includes(time));
  };

  const getReservationCountForDate = (date: Date): number => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dayReservations[dateKey]?.length || 0;
  };

  const getRemainingCapacity = (date: Date): number => {
    const count = getReservationCountForDate(date);
    return Math.max(0, MAX_CAKES_PER_DAY - count);
  };

  const isDateFullyBooked = (date: Date, allTimes: string[]): boolean => {
    const reserved = getReservedTimesForDate(date);
    // Date is fully booked if:
    // 1. All time slots are taken, OR
    // 2. Maximum daily capacity is reached
    return reserved.length >= allTimes.length || reserved.length >= MAX_CAKES_PER_DAY;
  };

  const createReservation = async (
    customerName: string,
    customerPhone: string,
    reservationDate: Date,
    reservationTime: string,
    cakeDescription?: string
  ) => {
    // Check capacity before creating
    const currentCount = getReservationCountForDate(reservationDate);
    if (currentCount >= MAX_CAKES_PER_DAY) {
      throw new Error('Capacidade máxima de produção atingida para esta data');
    }

    const { data, error } = await supabase
      .from('cake_reservations')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        reservation_date: format(reservationDate, 'yyyy-MM-dd'),
        reservation_time: reservationTime,
        cake_description: cakeDescription,
      })
      .select()
      .single();

    if (error) throw error;

    // Refresh reservations
    await fetchReservations();
    return data;
  };

  return {
    reservations,
    dayReservations,
    loading,
    maxCakesPerDay: MAX_CAKES_PER_DAY,
    fetchReservations,
    getReservedTimesForDate,
    getAvailableTimesForDate,
    getReservationCountForDate,
    getRemainingCapacity,
    isDateFullyBooked,
    createReservation,
  };
};
