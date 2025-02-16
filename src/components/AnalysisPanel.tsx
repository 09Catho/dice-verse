import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
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

interface AnalysisPanelProps {
  rolls: number[];
}

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export function AnalysisPanel({ rolls }: AnalysisPanelProps) {
  if (rolls.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-400">Roll the dice to see analysis</p>
      </div>
    );
  }

  // Prepare data for charts
  const rollData = rolls.map((value, index) => ({
    roll: index + 1,
    value,
  }));

  // Calculate frequencies
  const frequencies = rolls.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const frequencyData = Object.entries(frequencies).map(([value, count]) => ({
    name: `Value ${value}`,
    value: count,
    percentage: ((count / rolls.length) * 100).toFixed(1)
  }));

  // Calculate moving average
  const movingAverageData = rolls.map((value, index) => {
    const window = rolls.slice(Math.max(0, index - 4), index + 1);
    const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
    return {
      roll: index + 1,
      value,
      average: Number(avg.toFixed(2)),
    };
  });

  // Calculate probability distribution
  const probabilityData = Object.entries(frequencies).map(([value, count]) => ({
    value: parseInt(value),
    actual: count / rolls.length,
    expected: 1 / 6, // For a fair six-sided die
  }));

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4">Analysis</h2>
      <Tabs defaultValue="timeline" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="probability">Probability</TabsTrigger>
          <TabsTrigger value="average">Moving Avg</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rollData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="roll" label={{ value: 'Roll Number', position: 'bottom' }} stroke="#9CA3AF" />
              <YAxis label={{ value: 'Value', angle: -90, position: 'left' }} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F9FAFB',
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="distribution" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis label={{ value: 'Frequency', angle: -90, position: 'left' }} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F9FAFB',
                }}
              />
              <Bar dataKey="value" fill="#8B5CF6">
                {frequencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="probability" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={probabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="value" label={{ value: 'Dice Value', position: 'bottom' }} stroke="#9CA3AF" />
              <YAxis label={{ value: 'Probability', angle: -90, position: 'left' }} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F9FAFB',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8B5CF6" name="Actual" />
              <Line type="monotone" dataKey="expected" stroke="#10B981" name="Expected" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="average" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={movingAverageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="roll" label={{ value: 'Roll Number', position: 'bottom' }} stroke="#9CA3AF" />
              <YAxis label={{ value: 'Value', angle: -90, position: 'left' }} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F9FAFB',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} name="Roll Value" />
              <Area type="monotone" dataKey="average" stroke="#10B981" fill="#10B981" fillOpacity={0.1} name="Moving Average" />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="pie" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={frequencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {frequencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}