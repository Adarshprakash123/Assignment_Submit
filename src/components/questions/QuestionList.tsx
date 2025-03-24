
import { useEffect, useState } from 'react';
import QuestionCard, { Question } from './QuestionCard';
import ProgressIndicator from '../ui/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface QuestionListProps {
  questions: Question[];
  date: string;
  allowSubmit?: boolean;
  savedAnswers?: Record<string, string>;
  onSubmit?: (answers: Record<string, string>) => void;
}

const QuestionList = ({
  questions,
  date,
  allowSubmit = true,
  savedAnswers = {},
  onSubmit,
}: QuestionListProps) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Object.keys(savedAnswers).length > 0);
  
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  
  useEffect(() => {
    setAnswers(savedAnswers);
    setIsSubmitted(Object.keys(savedAnswers).length > 0);
  }, [savedAnswers]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (answeredQuestions < totalQuestions) {
      toast({
        title: "Not all questions answered",
        description: `Please answer all ${totalQuestions} questions before submitting.`,
        variant: "destructive"
      });
      return;
    }

    if (onSubmit) {
      onSubmit(answers);
    }
    
    setIsSubmitted(true);
    
    toast({
      title: "Questions submitted!",
      description: "Your answers have been recorded.",
    });

    // Navigate to results page after submission
    setTimeout(() => {
      navigate('/results');
    }, 1500);
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] glass-card rounded-xl p-8">
        <h3 className="text-xl font-semibold mb-2">No questions available</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
          There are no questions available for this date.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium">{date}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
          </p>
        </div>
        
        <ProgressIndicator 
          value={progress} 
          label={`${answeredQuestions}/${totalQuestions} answered`}
          className="w-full sm:w-48"
        />
      </div>

      <div className="space-y-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            userAnswer={answers[question.id]}
            isRevealed={isSubmitted}
            onAnswer={handleAnswer}
            className="animate-slide-in"
          />
        ))}
      </div>
      
      {allowSubmit && !isSubmitted && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSubmit}
            className="relative overflow-hidden group"
            disabled={answeredQuestions < totalQuestions}
          >
            <span className="relative z-10">Submit All Answers</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
