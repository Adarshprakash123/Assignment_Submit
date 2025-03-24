
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Award } from "lucide-react";
import { CSSProperties } from "react";

interface ResultCardProps {
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  className?: string;
  style?: CSSProperties;
}

const ResultCard = ({
  title,
  date,
  score,
  totalQuestions,
  className,
  style,
}: ResultCardProps) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const scoreColor = percentage >= 80 ? "text-green-500" : percentage >= 60 ? "text-yellow-500" : "text-red-500";
  
  // Add a badge/award based on score percentage
  const getBadge = () => {
    if (percentage >= 90) return { icon: <Award className="h-5 w-5 text-yellow-500" />, text: "Excellent" };
    if (percentage >= 75) return { icon: <Award className="h-5 w-5 text-blue-500" />, text: "Great" };
    if (percentage >= 60) return { icon: <Award className="h-5 w-5 text-teal-500" />, text: "Good" };
    return null;
  };
  
  const badge = getBadge();
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg glass-card cursor-pointer",
        className
      )}
      style={style}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>{title}</span>
          <span className={cn("text-xl font-semibold", scoreColor)}>
            {percentage}%
          </span>
        </CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {score} correct
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalQuestions - score} incorrect
            </span>
          </div>
        </div>
        
        {badge && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 justify-center">
            {badge.icon}
            <span className="text-sm font-medium">{badge.text} Performance</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultCard;
