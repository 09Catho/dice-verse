import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { DiceSimulator } from './components/DiceSimulator';
import { AnalysisPanel } from './components/AnalysisPanel';
import { StatisticsPanel } from './components/StatisticsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

export default function App() {
  const [rolls, setRolls] = useState<number[]>([]);
  const [autoRoll, setAutoRoll] = useState(false);

  const handleRoll = (value: number) => {
    setRolls(prev => [...prev, value]);
  };

  const exportData = () => {
    // Calculate probabilities
    const frequencies = rolls.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const probabilities = Object.entries(frequencies).map(([value, count]) => ({
      value: parseInt(value),
      count,
      probability: (count / rolls.length).toFixed(4),
      percentage: ((count / rolls.length) * 100).toFixed(2) + '%'
    }));

    // Prepare export data
    const exportData = {
      summary: {
        totalRolls: rolls.length,
        average: (rolls.reduce((a, b) => a + b, 0) / rolls.length).toFixed(2),
        min: Math.min(...rolls),
        max: Math.max(...rolls)
      },
      probabilities,
      rollHistory: rolls,
      timestamp: new Date().toISOString()
    };

    // Convert to CSV
    const csvContent = [
      // Summary section
      'Summary:',
      'Total Rolls,Average,Minimum,Maximum',
      `${exportData.summary.totalRolls},${exportData.summary.average},${exportData.summary.min},${exportData.summary.max}`,
      '',
      // Probabilities section
      'Probabilities:',
      'Value,Count,Probability,Percentage',
      ...probabilities.map(p => `${p.value},${p.count},${p.probability},${p.percentage}`),
      '',
      // Roll history section
      'Roll History:',
      'Roll Number,Value',
      ...rolls.map((value, index) => `${index + 1},${value}`)
    ].join('\\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dice-roll-analysis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dice Simulator</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Auto Roll</span>
              <Switch 
                checked={autoRoll} 
                onCheckedChange={setAutoRoll}
              />
            </div>
            <Button 
              onClick={() => setRolls([])}
              variant="outline"
            >
              Reset
            </Button>
            <Button
              onClick={exportData}
              disabled={rolls.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <Card className="p-6 bg-gray-800">
              <DiceSimulator 
                diceType="d6"
                isRolling={autoRoll}
                rollSpeed={1000}
                soundEnabled={false}
                onRoll={handleRoll}
              />
            </Card>

            <Card className="p-6 bg-gray-800">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <StatisticsPanel rolls={rolls} />
            </Card>
          </div>

          {/* Right Column */}
          <Card className="p-6 bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Analysis</h2>
            <AnalysisPanel rolls={rolls} />
          </Card>
        </div>

        {/* Roll History and Probabilities */}
        <Card className="p-6 bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Roll History & Probabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Roll History */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Recent Rolls</h3>
              <div className="flex flex-wrap gap-2">
                {rolls.slice(-20).map((roll, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg text-white font-bold"
                  >
                    {roll}
                  </span>
                ))}
              </div>
            </div>
            {/* Probabilities */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Probabilities</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(value => {
                  const count = rolls.filter(r => r === value).length;
                  const probability = rolls.length ? (count / rolls.length * 100).toFixed(1) : '0.0';
                  return (
                    <div key={value} className="bg-gray-700 p-2 rounded-lg text-center">
                      <div className="text-sm text-gray-300">Value {value}</div>
                      <div className="font-bold">{probability}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}