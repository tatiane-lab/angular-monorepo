const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formats a number as Brazilian Real. */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Truncates text adding an ellipsis when longer than `max`. */
export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…` : text;
}
