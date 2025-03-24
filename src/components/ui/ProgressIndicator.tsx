
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  value: number;
  label?: string;
  className?: string;
}

const ProgressIndicator = ({
  value,
  label,
  className,
}: ProgressIndicatorProps) => {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <Progress 
        value={clampedValue} 
        className="h-2 bg-gray-200 dark:bg-gray-700"
      />
    </div>
  );
};

export default ProgressIndicator;
