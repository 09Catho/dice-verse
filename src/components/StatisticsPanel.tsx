import React from 'react';
import { Card } from '@/components/ui/card';

interface StatisticsPanelProps {
  rolls: number[];
}

export function StatisticsPanel({ rolls }: StatisticsPanelProps) {
  if (rolls.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">Roll the dice to see statistics</p>
      </div>
    );
  }

  // Basic statistics
  const total = rolls.reduce((sum, val) => sum + val, 0);
  const average = total / rolls.length;
  const min = Math.min(...rolls);
  const max = Math.max(...rolls);

  // Calculate frequencies
  const frequencies = rolls.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Find mode (most common value)
  const mode = Object.entries(frequencies).reduce((a, b) => 
    frequencies[parseInt(a[0])] > frequencies[parseInt(b[0])] ? a : b
  )[0];

  // Calculate variance and standard deviation
  const variance = rolls.reduce((sum, val) => 
    sum + Math.pow(val - average, 2), 0) / rolls.length;
  const stdDev = Math.sqrt(variance);

  // Calculate streak information
  let currentStreak = 1;
  let longestStreak = 1;
  let currentValue = rolls[0];

  for (let i = 1; i < rolls.length; i++) {
    if (rolls[i] === currentValue) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
      currentValue = rolls[i];
    }
  }

  const stats = [
    { label: 'Total Rolls', value: rolls.length },
    { label: 'Average', value: average.toFixed(2) },
    { label: 'Minimum', value: min },
    { label: 'Maximum', value: max },
    { label: 'Most Common', value: `${mode} (${frequencies[parseInt(mode)]} times)` },
    { label: 'Total Sum', value: total },
    { label: 'Standard Deviation', value: stdDev.toFixed(2) },
    { label: 'Longest Streak', value: longestStreak },
    { label: 'Last 5 Rolls', value: rolls.slice(-5).join(', ') }
  ];

  // Calculate percentages for each value
  const percentages = Object.entries(frequencies).map(([value, count]) => ({
    value,
    percentage: ((count / rolls.length) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Distribution Table */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Value Distribution</h3>
        <div className="grid grid-cols-6 gap-2">
          {percentages.map(({ value, percentage }) => (
            <div key={value} className="text-center">
              <div className="text-sm text-gray-400">Value {value}</div>
              <div className="font-bold">{percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}