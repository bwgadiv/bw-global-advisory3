
export const DEFAULT_WEIGHTS = {
  ER: 0.25,
  SP: 0.20,
  CC: 0.15,
  PR: 0.15,
  CA: 0.10,
  EA: 0.10,
  UT: 0.05
};

function clamp(n: number) { return Math.max(0, Math.min(100, n || 50)); }

export function computeSPI(input: any) {
  const s = {
    ER: clamp(input.ER), SP: clamp(input.SP), CC: clamp(input.CC),
    PR: clamp(input.PR), CA: clamp(input.CA), EA: clamp(input.EA),
    UT: clamp(input.UT)
  };
  const w = { ...DEFAULT_WEIGHTS, ...(input.weights || {}) };

  const sum = Object.values(w).reduce((a: number, b: number) => a + b, 0) as number;
  const n: any = {};
  Object.keys(w).forEach(k => (n[k] = (w as any)[k] / sum));

  let spi = 0;
  Object.keys(s).forEach(k => spi += (s as any)[k] * n[k]);

  const ci = 12 * (1 - s.UT / 100);
  return {
    spi: +spi.toFixed(2),
    ciLow: +(spi - ci).toFixed(2),
    ciHigh: +(spi + ci).toFixed(2),
    breakdown: s,
    weights: n
  };
}
