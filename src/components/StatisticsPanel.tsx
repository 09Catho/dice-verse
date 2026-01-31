import { useDice } from '@/context/DiceContext';
import { Card } from '@/components/ui/card';
import { calculateMean, calculateStandardDeviation, calculateMode, calculateFrequencies } from '@/lib/statistics';

export function StatisticsPanel() {
  const { history, config } = useDice();

  if (history.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <p className="text-gray-400">Roll the dice to see statistics</p>
      </div>
    );
  }

  // We analyze the TOTAL value of each roll event
  const rolls = history.map(h => h.total);

  const total = rolls.reduce((sum, val) => sum + val, 0);
  const average = calculateMean(rolls);
  const min = Math.min(...rolls);
  const max = Math.max(...rolls);
  const modes = calculateMode(rolls);
  const stdDev = calculateStandardDeviation(rolls);

  // Calculate streak
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
    { label: 'Average Total', value: average.toFixed(2) },
    { label: 'Minimum', value: min },
    { label: 'Maximum', value: max },
    { label: 'Mode', value: modes.join(', ') },
    { label: 'Sum of All Rolls', value: total },
    { label: 'Std Deviation', value: stdDev.toFixed(2) },
    { label: 'Longest Streak', value: longestStreak },
  ];

  const frequencies = calculateFrequencies(rolls);
  const percentages = Object.entries(frequencies)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([value, count]) => ({
      value,
      percentage: ((count / rolls.length) * 100).toFixed(1)
    }));

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur border-gray-700">
      <h2 className="text-xl font-semibold mb-6">Statistics ({config.count}{config.type})</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-xl font-bold text-white truncate" title={String(value)}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">Distribution Table</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {percentages.map(({ value, percentage }) => (
            <div key={value} className="text-center p-2 bg-gray-800 rounded">
              <div className="text-xs text-gray-400">Total {value}</div>
              <div className="font-bold text-purple-400">{percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
