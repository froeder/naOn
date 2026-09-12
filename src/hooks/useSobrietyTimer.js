import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Hook de cronômetro vivo de sobriedade e cálculo de economia
 * @param {string|Date} startDate - Data inicial de início da sobriedade
 * @param {number} dailyCost - Custo médio diário da substância em R$
 */
export function useSobrietyTimer(startDate, dailyCost = 0) {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    // Atualiza a cada 1 segundo para manter o cronômetro 'vivo'
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timerData = useMemo(() => {
    if (!startDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHours: 0,
        totalDays: 0,
        moneySaved: 0,
        formattedMoney: 'R$ 0,00',
        relativeText: 'Recém-iniciado',
      };
    }

    const start = dayjs(startDate);
    const diffMs = Math.max(0, now.diff(start));
    const dur = dayjs.duration(diffMs);

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(dur.asDays());
    const hours = dur.hours();
    const minutes = dur.minutes();
    const seconds = dur.seconds();

    const totalHours = dur.asHours();
    const totalDaysFraction = diffMs / (1000 * 60 * 60 * 24);

    // Cálculo proporcional de economia financeira
    const moneySaved = Math.max(0, totalDaysFraction * (Number(dailyCost) || 0));

    const formattedMoney = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(moneySaved);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      totalHours,
      totalDaysFraction,
      moneySaved,
      formattedMoney,
      startDateFormatted: start.format('DD/MM/YYYY [às] HH:mm'),
    };
  }, [startDate, dailyCost, now]);

  return timerData;
}
