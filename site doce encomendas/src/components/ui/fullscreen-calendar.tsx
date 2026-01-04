"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfWeek,
  isBefore,
  startOfDay,
  addDays,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock,
  AlertCircle,
  CalendarCheck,
  Loader2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"

interface FullscreenReservationCalendarProps {
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  selectedTime: string
  onSelectTime: (time: string) => void
  allTimes: string[]
  minDaysAhead?: number
  loading?: boolean
  maxCakesPerDay?: number
  getReservationCountForDate: (date: Date) => number
  getRemainingCapacity: (date: Date) => number
  isDateFullyBooked: (date: Date, times: string[]) => boolean
  getAvailableTimesForDate: (date: Date, times: string[]) => string[]
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function FullscreenReservationCalendar({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  allTimes,
  minDaysAhead = 2,
  loading = false,
  maxCakesPerDay = 5,
  getReservationCountForDate,
  getRemainingCapacity,
  isDateFullyBooked,
  getAvailableTimesForDate,
}: FullscreenReservationCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy")
  )
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const isDesktop = !useIsMobile()
  const minDate = addDays(today, minDaysAhead)

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  const isDateDisabled = (date: Date) => {
    if (isBefore(startOfDay(date), startOfDay(minDate))) {
      return true
    }
    if (isDateFullyBooked(date, allTimes)) {
      return true
    }
    return false
  }

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  const handleDayClick = (day: Date) => {
    if (!isDateDisabled(day)) {
      onSelectDate(day)
    }
  }

  const availableTimes = selectedDate
    ? getAvailableTimesForDate(selectedDate, allTimes)
    : []

  const reservedTimes = selectedDate
    ? allTimes.filter((t) => !availableTimes.includes(t))
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando disponibilidade...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="flex flex-col gap-4 border-b border-border/50 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center gap-4">
          {/* Today indicator */}
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
            <span className="text-xs font-medium uppercase">
              {format(today, "MMM", { locale: ptBR })}
            </span>
            <span className="text-xl font-bold">
              {format(today, "d")}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">
              {format(firstDayCurrentMonth, "MMMM yyyy", { locale: ptBR })}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(firstDayCurrentMonth, "d MMM", { locale: ptBR })} -{" "}
              {format(endOfMonth(firstDayCurrentMonth), "d MMM yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Month navigation */}
          <div className="flex items-center rounded-lg border border-border/50 bg-background/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-r-none hover:bg-muted"
              onClick={previousMonth}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="ghost"
              className="h-9 px-3 text-sm hover:bg-muted"
              onClick={goToToday}
            >
              Hoje
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-l-none hover:bg-muted"
              onClick={nextMonth}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30 text-center text-xs font-medium text-muted-foreground">
          {weekDays.map((day) => (
            <div key={day} className="py-2.5 border-r border-border/30 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="flex-1">
          {/* Desktop View */}
          {isDesktop ? (
            <div className="grid h-full grid-cols-7 auto-rows-fr">
              {days.map((day, dayIdx) => {
                const count = getReservationCountForDate(day)
                const remaining = getRemainingCapacity(day)
                const isFull = isDateFullyBooked(day, allTimes)
                const isDisabled = isDateDisabled(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const hasReservations = count > 0 && !isFull

                return (
                  <div
                    key={dayIdx}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      "relative flex flex-col border-b border-r border-border/30 p-2 min-h-[80px] cursor-pointer transition-smooth",
                      !isSameMonth(day, firstDayCurrentMonth) && "bg-muted/30 text-muted-foreground",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      !isDisabled && !isSelected && "hover:bg-accent/50",
                      isSelected && "bg-primary/10 ring-2 ring-primary ring-inset",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                          isToday(day) && "bg-primary text-primary-foreground",
                          isSelected && !isToday(day) && "bg-primary/20 text-primary",
                          isFull && "line-through text-destructive"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex-1 space-y-0.5">
                      {hasReservations && (
                        <>
                          <div className="rounded bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5">
                            <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300">
                              {count}/{maxCakesPerDay} bolos
                            </span>
                          </div>
                          <div className="rounded bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5">
                            <span className="text-[10px] font-medium text-green-700 dark:text-green-300">
                              {remaining} {remaining === 1 ? "vaga" : "vagas"}
                            </span>
                          </div>
                        </>
                      )}
                      {isFull && (
                        <div className="rounded bg-destructive/20 px-1.5 py-0.5">
                          <span className="text-[10px] font-medium text-destructive">
                            Lotado ({maxCakesPerDay}/{maxCakesPerDay})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Mobile View */
            <div className="grid grid-cols-7">
              {days.map((day, dayIdx) => {
                const count = getReservationCountForDate(day)
                const isFull = isDateFullyBooked(day, allTimes)
                const isDisabled = isDateDisabled(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const hasReservations = count > 0 && !isFull

                return (
                  <button
                    key={dayIdx}
                    onClick={() => handleDayClick(day)}
                    disabled={isDisabled}
                    className={cn(
                      "flex h-12 flex-col items-center justify-center border-b border-r border-border/30 text-sm transition-smooth",
                      !isSameMonth(day, firstDayCurrentMonth) && "text-muted-foreground",
                      isDisabled && "opacity-40 cursor-not-allowed",
                      !isDisabled && !isSelected && "hover:bg-muted",
                      isSelected && "bg-primary text-primary-foreground font-semibold",
                      isToday(day) && !isSelected && "font-bold text-primary",
                      hasReservations && !isSelected && "bg-amber-100/50 dark:bg-amber-900/20",
                      isFull && "line-through text-destructive/60",
                    )}
                  >
                    <span>{format(day, "d")}</span>
                    {hasReservations && !isSelected && (
                      <span className="h-1 w-1 rounded-full bg-amber-500 mt-0.5" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 border-t border-border/50 px-4 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-300" />
          <span>Com reservas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300" />
          <span>Vagas restantes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30" />
          <span>Lotado</span>
        </div>
        <div className="ml-auto text-muted-foreground/70">
          Capacidade: {maxCakesPerDay} bolos/dia
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="border-t border-border/50 px-4 py-4 space-y-3 bg-muted/20">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">
              Horários para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>

          {availableTimes.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {allTimes.map((time) => {
                const isReserved = reservedTimes.includes(time)
                const isSelected = selectedTime === time

                return (
                  <button
                    key={time}
                    onClick={() => !isReserved && onSelectTime(time)}
                    disabled={isReserved}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                      "border border-border/50",
                      isReserved && "bg-destructive/10 text-destructive/60 cursor-not-allowed line-through",
                      !isReserved && !isSelected && "bg-background hover:bg-primary/10 hover:border-primary/50",
                      isSelected && "bg-primary text-primary-foreground border-primary shadow-soft"
                    )}
                  >
                    {time}
                    {isReserved && (
                      <span className="block text-[10px] font-normal">Reservado</span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Todos os horários estão reservados para esta data.</span>
            </div>
          )}

          {/* Summary */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <CalendarCheck className="w-4 h-4" />
            <span>
              {availableTimes.length} de {allTimes.length} horários disponíveis
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
