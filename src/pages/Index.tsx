
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import QuestionList from '@/components/questions/QuestionList';
import { todaysQuestions, getDateString, saveAnswers, getSavedAnswers } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [hasCompleted, setHasCompleted] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  
  useEffect(() => {
    // Check if user has already completed today's quiz
    const results = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    const todayResult = results.find((r: any) => r.id === 'today');
    const hasCompletedToday = todayResult?.isCompleted && isSignedIn;
    
    if (hasCompletedToday) {
      setHasCompleted(true);
      toast({
        title: "Already completed",
        description: "You've already completed today's quiz. Check your results or view history.",
        variant: "default",
      });
    } else {
      // Load any previously saved answers if not completed
      const answers = getSavedAnswers('today');
      setSavedAnswers(answers);
    }
  }, [isSignedIn]);
  
  const handleSubmit = (answers: Record<string, string>) => {
    if (!isSignedIn) {
      // Allow guest users to see their score but encourage sign in
      const score = saveAnswers('today', answers);
      toast({
        title: "Quiz Complete!",
        description: `You scored ${score} out of ${todaysQuestions.length}. Sign in to save your results!`,
      });
      return;
    }
    
    // For signed in users, associate results with their account
    const score = saveAnswers('today', answers, user?.id);
    setHasCompleted(true);
    
    // Show toast with score
    toast({
      title: "Quiz Complete!",
      description: `You scored ${score} out of ${todaysQuestions.length}.`,
    });
    
    // Navigate to results page after submission for signed-in users
    setTimeout(() => {
      navigate('/results');
    }, 1500);
  };
  
  return (
    <div className="page-container pt-24 pb-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Today's Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Answer all questions to see your results. You can review your answers after submission.
        </p>
      </div>
      
      {hasCompleted ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] glass-card rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-2">You've completed today's quiz</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
            Come back tomorrow for new questions or check your results.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/results')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              View Results
            </button>
            <button 
              onClick={() => navigate('/history')}
              className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
            >
              View History
            </button>
          </div>
        </div>
      ) : (
        <QuestionList
          questions={todaysQuestions}
          date={getDateString(0)}
          allowSubmit={true}
          savedAnswers={savedAnswers}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Index;
