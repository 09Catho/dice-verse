import { useDice } from '@/context/DiceContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateFrequencies, getExpectedProbability } from '@/lib/statistics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#3B82F6', '#A855F7'];

export function AnalysisPanel() {
  const { history, config } = useDice();

  if (history.length === 0) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Roll the dice to see analysis</p>
      </Card>
    );
  }

  // Use totals for analysis
  const rolls = history.map(h => h.total);

  // Frequencies
  const frequencies = calculateFrequencies(rolls);
  const distributionData = Object.entries(frequencies)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([value, count]) => ({
      name: value,
      value: count,
      percentage: ((count / rolls.length) * 100).toFixed(1)
    }));

  // Probability Data
  // We only calculate expected probability for single die rolls easily
  const showExpected = config.count === 1;
  const expectedProbs = showExpected ? getExpectedProbability(config.type) : {};

  const probabilityData = Object.entries(frequencies)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([value, count]) => {
      const val = parseInt(value);
      return {
        value: val,
        actual: count / rolls.length,
        expected: showExpected ? (expectedProbs[val] || 0) : 0
      };
    });

  // If showing expected, fill in missing values (e.g. if we rolled 1, 2, 6, we still want 3, 4, 5 on the chart with 0 actual)
  if (showExpected) {
     const sides = parseInt(config.type.substring(1));
     for (let i = 1; i <= sides; i++) {
         if (!probabilityData.find(d => d.value === i)) {
             probabilityData.push({
                 value: i,
                 actual: 0,
                 expected: expectedProbs[i] || 0
             });
         }
     }
     probabilityData.sort((a, b) => a.value - b.value);
  }

  // Moving Average
  const movingAverageData = rolls.map((value, index) => {
    const windowSize = 5;
    const window = rolls.slice(Math.max(0, index - windowSize + 1), index + 1);
    const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
    return {
      roll: index + 1,
      value,
      average: Number(avg.toFixed(2)),
    };
  });

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Analysis</h2>
        <div className="text-sm text-gray-400">
           {config.count > 1 ? `Analyzing Sum of ${config.count}${config.type}` : `Analyzing ${config.type}`}
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="probability">Probability</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="h-[350px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={movingAverageData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="roll" stroke="#9CA3AF" tick={{fontSize: 12}} label={{ value: 'Roll #', position: 'bottom', fill: '#6B7280' }} />
              <YAxis stroke="#9CA3AF" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
              />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorValue)" name="Value" />
              <Line type="monotone" dataKey="average" stroke="#10B981" dot={false} strokeWidth={2} name="Mov. Avg (5)" />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="distribution" className="h-[350px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{fontSize: 12}} />
              <YAxis stroke="#9CA3AF" tick={{fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#374151', opacity: 0.2}}
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
              />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                {distributionData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="probability" className="h-[350px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={probabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="value" stroke="#9CA3AF" tick={{fontSize: 12}} />
              <YAxis tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} stroke="#9CA3AF" tick={{fontSize: 12}} />
              <Tooltip 
                formatter={(val: number) => (val * 100).toFixed(1) + '%'}
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
              />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8B5CF6" strokeWidth={3} name="Actual" dot={{r: 4}} />
              {showExpected && (
                <Line type="step" dataKey="expected" stroke="#10B981" strokeWidth={2} name="Theoretical" strokeDasharray="5 5" dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="pie" className="h-[350px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {distributionData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
