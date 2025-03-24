
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionCardProps {
  question: Question;
  userAnswer?: string;
  isRevealed?: boolean;
  onAnswer?: (questionId: string, answer: string) => void;
  className?: string;
}

const QuestionCard = ({
  question,
  userAnswer,
  isRevealed = false,
  onAnswer,
  className,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer);
  const [isAnswered, setIsAnswered] = useState<boolean>(!!userAnswer);
  const [showResult, setShowResult] = useState<boolean>(isRevealed);
  
  const isReadOnly = isRevealed || isAnswered;
  const isCorrect = userAnswer === question.correctAnswer || selectedOption === question.correctAnswer;

  const handleOptionChange = (value: string) => {
    if (isReadOnly) return;
    setSelectedOption(value);
  };

  const handleSubmit = () => {
    if (!selectedOption || isReadOnly) return;
    
    setIsAnswered(true);
    setShowResult(true);
    
    if (onAnswer) {
      onAnswer(question.id, selectedOption);
    }
  };

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300 transform hover:shadow-lg glass-card w-full',
      isAnswered && 'border-2',
      isAnswered && isCorrect ? 'border-green-500/50' : (isAnswered ? 'border-red-500/50' : ''),
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">{question.text}</CardTitle>
        {showResult && (
          <CardDescription className="flex items-center mt-2 font-medium">
            {isCorrect ? (
              <span className="text-green-500 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Correct
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <XCircle className="h-4 w-4" /> Incorrect
              </span>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          className="space-y-3"
          disabled={isReadOnly}
        >
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = question.correctAnswer === option;
            const isWrongSelection = showResult && isSelected && !isCorrectOption;
            
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center p-3 rounded-lg transition-all duration-200',
                  'border border-gray-200 dark:border-gray-800',
                  isSelected && !showResult && 'border-primary bg-primary/5',
                  showResult && isCorrectOption && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                  isWrongSelection && 'border-red-500 bg-red-50 dark:bg-red-900/20'
                )}
              >
                <RadioGroupItem
                  id={`option-${question.id}-${index}`}
                  value={option}
                  className={cn(
                    isCorrectOption && showResult && 'text-green-500 border-green-500',
                    isWrongSelection && 'text-red-500 border-red-500'
                  )}
                />
                <Label
                  htmlFor={`option-${question.id}-${index}`}
                  className={cn(
                    'ml-2 cursor-pointer w-full',
                    isCorrectOption && showResult && 'text-green-600 dark:text-green-400 font-medium',
                    isWrongSelection && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {option}
                </Label>
                {showResult && isCorrectOption && (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                )}
                {isWrongSelection && (
                  <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
      {!isReadOnly && (
        <CardFooter className="flex justify-end pt-0">
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOption || isReadOnly}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">Submit Answer</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuestionCard;
