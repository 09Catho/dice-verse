import { cn } from '@/lib/utils';
import { DieType } from '@/types';

interface DieProps {
  value: number;
  type: DieType;
  rolling?: boolean;
  className?: string;
}

const DieShape = ({ type, className }: { type: DieType; className?: string }) => {
  switch (type) {
    case 'd4':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M50 15 L90 85 H10 Z" fill="currentColor" stroke="white" strokeWidth="4" />
        </svg>
      );
    case 'd6':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="15" y="15" width="70" height="70" rx="10" fill="currentColor" stroke="white" strokeWidth="4" />
        </svg>
      );
    case 'd8':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor" stroke="white" strokeWidth="4" />
        </svg>
      );
    case 'd10':
      return (
        <svg viewBox="0 0 100 100" className={className}>
           <path d="M50 10 L90 40 L50 90 L10 40 Z" fill="currentColor" stroke="white" strokeWidth="4" />
           <path d="M10 40 L90 40" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
        </svg>
      );
    case 'd12':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M50 10 L85 35 L75 80 L25 80 L15 35 Z" fill="currentColor" stroke="white" strokeWidth="4" />
        </svg>
      );
    case 'd20':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M50 10 L85 28 L85 72 L50 90 L15 72 L15 28 Z" fill="currentColor" stroke="white" strokeWidth="4" />
          <path d="M50 10 L50 90 M85 28 L15 72 M15 28 L85 72" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
};

export function Die({ value, type, rolling, className }: DieProps) {
  return (
    <div className={cn(
      "relative flex items-center justify-center w-24 h-24 transition-transform",
      rolling && "animate-spin duration-500",
      className
    )}>
      <DieShape type={type} className="w-full h-full text-purple-600 drop-shadow-xl" />
      <span className={cn(
        "absolute text-white font-bold select-none",
        type === 'd4' ? "text-xl mb-[-10%]" : "text-3xl"
      )}>
        {value}
      </span>
    </div>
  );
}
