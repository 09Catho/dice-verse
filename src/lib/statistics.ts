export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateMode(values: number[]): number[] {
  if (values.length === 0) return [];
  const frequencies = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  let maxFreq = 0;
  for (const val in frequencies) {
    if (frequencies[val] > maxFreq) {
      maxFreq = frequencies[val];
    }
  }

  return Object.keys(frequencies)
    .filter(key => frequencies[parseInt(key)] === maxFreq)
    .map(key => parseInt(key))
    .sort((a, b) => a - b);
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function calculateFrequencies(values: number[]): Record<number, number> {
  return values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
}

export function getExpectedProbability(dieType: string): Record<number, number> {
  // Simple uniform distribution for single die
  const sides = parseInt(dieType.substring(1));
  const prob = 1 / sides;
  const result: Record<number, number> = {};
  for (let i = 1; i <= sides; i++) {
    result[i] = prob;
  }
  return result;
}
