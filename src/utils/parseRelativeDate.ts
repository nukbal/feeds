import { parseISO, differenceInMinutes, differenceInHours, differenceInDays, format, differenceInSeconds } from 'date-fns';

export default function parseRelativeDate(date?: string) {
  if (!date) return '-';

  const d = parseISO(date);
  const now = new Date();
  const diffMin = differenceInMinutes(now, d);
  // 7d+
  if (diffMin > 10080) return format(d, 'LLL d hh:mm');
  // 24h+
  if (diffMin > 1440) return [differenceInDays(now, d), 'd'].join('');
  // 60m+
  if (diffMin > 60) return [differenceInHours(now ,d), 'h'].join('');
  if (diffMin === 0) return [differenceInSeconds(now, d), 's'].join('');
  return [diffMin, 'm'].join('');
}
