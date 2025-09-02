export const fmt = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
