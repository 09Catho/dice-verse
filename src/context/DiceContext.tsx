import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { DiceConfig, RollHistoryItem } from '../types';
import { useDiceRunner } from '../hooks/useDiceRunner';

interface DiceContextType {
  config: DiceConfig;
  setConfig: (config: DiceConfig) => void;
  history: RollHistoryItem[];
  isRolling: boolean;
  autoRoll: boolean;
  setAutoRoll: (auto: boolean) => void;
  roll: () => void;
  clearHistory: () => void;
  lastRoll: RollHistoryItem | null;
}

const DiceContext = createContext<DiceContextType | undefined>(undefined);

export function DiceProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DiceConfig>({ count: 1, type: 'd6' });
  const [history, setHistory] = useState<RollHistoryItem[]>([]);
  const [autoRoll, setAutoRoll] = useState(false);
  const { isRolling, simulateRoll } = useDiceRunner();

  const roll = useCallback(async () => {
    if (isRolling) return;

    const results = await simulateRoll(config.count, config.type);

    const newItem: RollHistoryItem = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      results,
      total: results.reduce((sum, r) => sum + r.value, 0)
    };

    setHistory(prev => [...prev, newItem]);
  }, [config, isRolling, simulateRoll]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Auto roll effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRoll && !isRolling) {
      interval = setInterval(() => {
        roll();
      }, 1500); // Wait a bit between rolls
    }
    return () => clearInterval(interval);
  }, [autoRoll, isRolling, roll]);

  const value = {
    config,
    setConfig,
    history,
    isRolling,
    autoRoll,
    setAutoRoll,
    roll,
    clearHistory,
    lastRoll: history.length > 0 ? history[history.length - 1] : null
  };

  return (
    <DiceContext.Provider value={value}>
      {children}
    </DiceContext.Provider>
  );
}

export function useDice() {
  const context = useContext(DiceContext);
  if (context === undefined) {
    throw new Error('useDice must be used within a DiceProvider');
  }
  return context;
}
