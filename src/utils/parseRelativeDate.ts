
function twoDigits(num: number) {
  return `0${num}`.slice(-2);
}

export default function parseRelativeDate(date?: string, full?: boolean) {
  if (!date) return '-';

  const d = new Date(date);

  if (full) {
    const month = twoDigits(d.getMonth() + 1);
    const day = twoDigits(d.getDate());
    const hour = twoDigits(d.getHours());
    const minute = twoDigits(d.getMinutes());
    return `${d.getFullYear()}/${month}/${day} ${hour}:${minute}`;
  }

  const now = new Date();
  const diffMin = Math.round((now.getTime() - d.getTime()) / 60_000);

  if (window.isNaN(diffMin)) return date;

  // 7d+
  if (diffMin > 10080) return `${d.getMonth() + 1}/${d.getDate()}`;
  // 24h+
  if (diffMin > 1440) return [Math.round(diffMin / 1440), 'd'].join('');
  // 60m+
  if (diffMin > 60) return [Math.round(diffMin / 60), 'h'].join('');
  if (diffMin === 0) return [Math.round((now.getTime() - d.getTime()) / 1000), 's'].join('');
  return [diffMin, 'm'].join('');
}
