import { MainLayout } from './components/layout/MainLayout';
import { DiceRoller } from './components/dice/DiceRoller';
import { StatisticsPanel } from './components/StatisticsPanel';
import { AnalysisPanel } from './components/AnalysisPanel';

export default function App() {
  return (
    <MainLayout>
      {/* Dice Rolling Area */}
      <div className="flex flex-col items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm min-h-[400px]">
        <DiceRoller />
      </div>

      {/* Stats & Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <StatisticsPanel />
        <AnalysisPanel />
      </div>
    </MainLayout>
  );
}
