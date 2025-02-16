import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProbabilityChartData {
  value: number;
  actual: number;
  theoretical: number;
}

interface ProbabilityChartProps {
  data: ProbabilityChartData[];
  diceType: string;
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ data, diceType }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="value" 
          label={{ value: 'Dice Value', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          label={{ value: 'Probability', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="#8884d8" 
          name="Actual Probability"
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="theoretical" 
          stroke="#82ca9d" 
          name="Theoretical Probability"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProbabilityChart;