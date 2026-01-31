export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface RollResult {
  value: number;
  timestamp: number;
  id: string;
  type: DieType;
}

export interface DiceConfig {
  count: number;
  type: DieType;
}

export interface RollHistoryItem {
    id: string;
    timestamp: number;
    results: RollResult[]; // Can be multiple if rolling multiple dice
    total: number;
}
