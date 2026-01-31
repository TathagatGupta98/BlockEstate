export function normalizeTime(months) {
  if (months <= 3) return 1;
  if (months <= 6) return 0.8;
  if (months <= 12) return 0.5;
  return 0.3;
}

export function normalizeBudget(level) {
  if (level === "low") return 1;
  if (level === "medium") return 0.7;
  return 0.4;
}
