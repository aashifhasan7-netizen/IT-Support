import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy');
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy, hh:mm a');
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd MMM yyyy');
}
