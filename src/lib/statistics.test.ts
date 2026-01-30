import { describe, it, expect } from 'vitest';
import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateStandardDeviation,
  calculateFrequencies,
  getExpectedProbability
} from './statistics';

describe('Statistics Library', () => {
  it('calculates mean correctly', () => {
    expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
    expect(calculateMean([10, 20])).toBe(15);
    expect(calculateMean([])).toBe(0);
  });

  it('calculates median correctly', () => {
    expect(calculateMedian([1, 2, 3, 4, 5])).toBe(3);
    expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
    expect(calculateMedian([])).toBe(0);
  });

  it('calculates mode correctly', () => {
    expect(calculateMode([1, 2, 2, 3])).toEqual([2]);
    expect(calculateMode([1, 1, 2, 2])).toEqual([1, 2]);
    expect(calculateMode([])).toEqual([]);
  });

  it('calculates standard deviation correctly', () => {
    // Population std dev of [2, 4, 4, 4, 5, 5, 7, 9] is 2
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(calculateStandardDeviation(data)).toBeCloseTo(2);
  });

  it('calculates frequencies correctly', () => {
    expect(calculateFrequencies([1, 2, 2, 3])).toEqual({ 1: 1, 2: 2, 3: 1 });
  });

  it('calculates expected probability for d6', () => {
      const probs = getExpectedProbability('d6');
      expect(probs[1]).toBeCloseTo(1/6);
      expect(probs[6]).toBeCloseTo(1/6);
      expect(Object.keys(probs).length).toBe(6);
  });
});
