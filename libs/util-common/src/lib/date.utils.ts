/** Returns an ISO date (YYYY-MM-DD) for the given date. */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Adds a number of days to a date without mutating it. */
export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}
