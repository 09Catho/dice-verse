import { useEffect, useState, useRef } from 'react';
import { useDice } from '@/context/DiceContext';
import { Die } from './Die';
import { cn } from '@/lib/utils';
import { playDiceSound } from '@/lib/sounds';

export function DiceRoller() {
  const { config, isRolling, lastRoll } = useDice();
  const [displayValues, setDisplayValues] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Initialize display values when config changes
  useEffect(() => {
    setDisplayValues(new Array(config.count).fill(1));
  }, [config.count]);

  // Update display values when lastRoll changes (final result)
  useEffect(() => {
    if (lastRoll && !isRolling) {
      setDisplayValues(lastRoll.results.map(r => r.value));
      playDiceSound();
    }
  }, [lastRoll, isRolling]);

  // Animation effect
  useEffect(() => {
    if (isRolling) {
      intervalRef.current = setInterval(() => {
        setDisplayValues(prev =>
          prev.map(() => Math.floor(Math.random() * parseInt(config.type.substring(1))) + 1)
        );
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRolling, config.type]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 p-12 min-h-[300px] perspective-[1000px]">
      {displayValues.map((value, index) => (
        <div
            key={index}
            className={cn(
                "transition-all duration-300",
                isRolling ? "scale-110" : "scale-100"
            )}
        >
            <Die
              value={value}
              type={config.type}
              rolling={isRolling}
              className="w-32 h-32"
            />
        </div>
      ))}
    </div>
  );
}
