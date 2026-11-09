export const IST_OFFSET = '+0530';
export const IST_ZONE = 'Asia/Kolkata';
export function istInstant(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T00:00:00+05:30' : value;
}
export function istDay(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(istInstant(value));
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat('en-CA',{timeZone:IST_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
export function istToday(): string { return istDay(new Date())!; }
