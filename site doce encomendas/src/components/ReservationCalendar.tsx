import { useState } from 'react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useReservations } from '@/hooks/useReservations';
import { Loader2, CalendarCheck, Clock, AlertCircle } from 'lucide-react';

interface ReservationCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  allTimes: string[];
  minDaysAhead?: number;
}

export const ReservationCalendar = ({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  allTimes,
  minDaysAhead = 2,
}: ReservationCalendarProps) => {
  const {
    loading,
    getReservationCountForDate,
    getAvailableTimesForDate,
    isDateFullyBooked,
  } = useReservations();

  const minDate = addDays(new Date(), minDaysAhead);

  const isDateDisabled = (date: Date) => {
    // Before minimum date
    if (isBefore(startOfDay(date), startOfDay(minDate))) {
      return true;
    }
    // Fully booked
    if (isDateFullyBooked(date, allTimes)) {
      return true;
    }
    return false;
  };

  const availableTimes = selectedDate
    ? getAvailableTimesForDate(selectedDate, allTimes)
    : [];

  const reservedTimes = selectedDate
    ? allTimes.filter((t) => !availableTimes.includes(t))
    : [];

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando disponibilidade...</span>
        </div>
      ) : (
        <>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={isDateDisabled}
            locale={ptBR}
            className="rounded-lg border border-border/50 p-3 pointer-events-auto"
            modifiers={{
              booked: (date) => getReservationCountForDate(date) > 0 && !isDateFullyBooked(date, allTimes),
              fullyBooked: (date) => isDateFullyBooked(date, allTimes),
            }}
            modifiersClassNames={{
              booked: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 font-medium',
              fullyBooked: 'bg-destructive/20 text-destructive line-through opacity-50',
            }}
            components={{
              DayContent: ({ date }) => {
                const count = getReservationCountForDate(date);
                const isFull = isDateFullyBooked(date, allTimes);
                
                return (
                  <div className="relative flex flex-col items-center">
                    <span>{date.getDate()}</span>
                    {count > 0 && !isFull && (
                      <span className="absolute -bottom-1 text-[8px] font-bold text-amber-600 dark:text-amber-400">
                        {count}
                      </span>
                    )}
                    {isFull && (
                      <span className="absolute -bottom-1 text-[7px] font-bold text-destructive">
                        CHEIO
                      </span>
                    )}
                  </div>
                );
              },
            }}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary" />
              <span>Selecionado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-300" />
              <span>Com reservas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-destructive/20" />
              <span>Indisponível</span>
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  Horários para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>

              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {allTimes.map((time) => {
                    const isReserved = reservedTimes.includes(time);
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        onClick={() => !isReserved && onSelectTime(time)}
                        disabled={isReserved}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                          'border border-border/50',
                          isReserved && 'bg-destructive/10 text-destructive/60 cursor-not-allowed line-through',
                          !isReserved && !isSelected && 'bg-background hover:bg-primary/10 hover:border-primary/50',
                          isSelected && 'bg-primary text-primary-foreground border-primary'
                        )}
                      >
                        {time}
                        {isReserved && (
                          <span className="block text-[10px] font-normal">Reservado</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Todos os horários estão reservados para esta data.</span>
                </div>
              )}

              {/* Summary */}
              {selectedDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarCheck className="w-4 h-4" />
                  <span>
                    {availableTimes.length} de {allTimes.length} horários disponíveis
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
