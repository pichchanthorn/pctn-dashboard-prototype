export const fmtKHR = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n) + " ៛";

export const fmtKHRShort = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M ៛";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K ៛";
  return n + " ៛";
};

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const fmtDateShort = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const daysBetween = (a: string | Date, b: string | Date = new Date()) =>
  Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
