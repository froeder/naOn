import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MILESTONES } from '../services/mockData';

dayjs.extend(duration);

export function useSobrietyTimer(startDate, dailyCost = 0) {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const start = dayjs(startDate);
  const diffMs = Math.max(0, now.diff(start));
  const diffDur = dayjs.duration(diffMs);

  const totalDaysExact = diffMs / (1000 * 60 * 60 * 24);
  const totalHoursExact = diffMs / (1000 * 60 * 60);

  const days = Math.floor(diffDur.asDays());
  const hours = diffDur.hours();
  const minutes = diffDur.minutes();
  const seconds = diffDur.seconds();

  const moneySaved = Number(((dailyCost || 0) * totalDaysExact).toFixed(2));

  // Próxima conquista
  const nextMilestone = MILESTONES.find(m => m.days > totalDaysExact) || MILESTONES[MILESTONES.length - 1];
  const prevMilestoneDays = MILESTONES.slice().reverse().find(m => m.days <= totalDaysExact)?.days || 0;

  const progressRange = (nextMilestone.days - prevMilestoneDays) || 1;
  const currentProgress = totalDaysExact - prevMilestoneDays;
  const progressPercent = Math.min(100, Math.max(0, (currentProgress / progressRange) * 100));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDaysExact,
    totalHoursExact,
    moneySaved,
    nextMilestone,
    progressPercent: Math.round(progressPercent),
  };
}
