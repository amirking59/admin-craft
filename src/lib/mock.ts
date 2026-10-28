// Helpers for the demo's mock services. Delete this file with them once a real API is wired in.

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Sorts rows by a DataTable sort param: a field name, with a leading "-" for descending. */
export function sortRows<T>(rows: T[], sort?: string): T[] {
  if (!sort) return rows;
  const desc = sort.startsWith("-");
  const key = (desc ? sort.slice(1) : sort) as keyof T;
  return rows.toSorted((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * (desc ? -1 : 1));
}
