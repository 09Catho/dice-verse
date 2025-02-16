import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DiceSimulatorProps {
  diceType: string;
  isRolling: boolean;
  rollSpeed: number;
  soundEnabled: boolean;
  onRoll: (value: number) => void;
}

export function DiceSimulator({
  diceType,
  isRolling,
  rollSpeed,
  soundEnabled,
  onRoll
}: DiceSimulatorProps) {
  const [currentValue, setCurrentValue] = useState(1);
  const rollIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRolling) {
      rollIntervalRef.current = setInterval(() => {
        const newValue = Math.floor(Math.random() * 6) + 1;
        setCurrentValue(newValue);
        onRoll(newValue);
      }, rollSpeed);
    } else {
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
      }
    }

    return () => {
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
      }
    };
  }, [isRolling, rollSpeed, onRoll]);

  const handleManualRoll = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setCurrentValue(newValue);
    onRoll(newValue);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-32 h-32">
        <div className={cn(
          "w-full h-full bg-purple-600 rounded-lg shadow-lg flex items-center justify-center",
          "transition-transform duration-500",
          isRolling && "animate-[spin_1s_linear_infinite]"
        )}>
          <span className="text-4xl font-bold text-white">
            {currentValue}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleManualRoll}
        disabled={isRolling}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-purple-500/25"
      >
        Roll Dice
      </Button>
    </div>
  );
}