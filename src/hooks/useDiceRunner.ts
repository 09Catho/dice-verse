import { useState } from 'react';
import { DieType, RollResult } from '../types';

export function useDiceRunner() {
  const [isRolling, setIsRolling] = useState(false);

  const rollDie = (type: DieType): number => {
    const sides = parseInt(type.substring(1));
    return Math.floor(Math.random() * sides) + 1;
  };

  const simulateRoll = async (
    count: number,
    type: DieType,
    duration: number = 600
  ): Promise<RollResult[]> => {
    setIsRolling(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        setIsRolling(false);
        const results: RollResult[] = Array.from({ length: count }).map(() => ({
          value: rollDie(type),
          timestamp: Date.now(),
          id: Math.random().toString(36).substring(7),
          type
        }));
        resolve(results);
      }, duration);
    });
  };

  return {
    isRolling,
    simulateRoll,
  };
}
