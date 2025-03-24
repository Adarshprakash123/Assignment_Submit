
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import ResultCard from '@/components/ui/ResultCard';
import { getSavedResults } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Result {
  id: string;
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
  userId: string;
}

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const { isSignedIn, user } = useUser();
  
  useEffect(() => {
    // Load results from local storage for the current user
    const savedResults = getSavedResults(isSignedIn && user ? user.id : 'guest');
    setResults(savedResults);
  }, [isSignedIn, user]);
  
  // Calculate overall performance
  const completedQuizzes = results.filter(result => result.isCompleted);
  const totalScore = completedQuizzes.reduce((sum, result) => sum + result.score, 0);
  const totalQuestions = completedQuizzes.reduce((sum, result) => sum + result.totalQuestions, 0);
  const overallPercentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
  
  // Determine performance level
  let performanceLevel = 'Beginner';
  if (overallPercentage >= 90) performanceLevel = 'Expert';
  else if (overallPercentage >= 75) performanceLevel = 'Advanced';
  else if (overallPercentage >= 60) performanceLevel = 'Intermediate';
  
  const todayResult = results.find(r => r.id === 'today');
  const hasCompletedToday = todayResult?.isCompleted;
  
  return (
    <div className="page-container pt-24 pb-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Your Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and performance over time.
        </p>
      </div>
      
      {completedQuizzes.length > 0 ? (
        <>
          <div className="glass-card mb-8 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Correct Answers</h3>
                <p className="text-2xl font-bold text-primary">{totalScore} / {totalQuestions}</p>
              </div>
              
              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</h3>
                <p className="text-2xl font-bold text-primary">{overallPercentage}%</p>
              </div>
              
              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance Level</h3>
                <p className="text-2xl font-bold text-primary">{performanceLevel}</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              result.isCompleted && (
                <ResultCard
                  key={index}
                  title={result.title}
                  date={result.date}
                  score={result.score}
                  totalQuestions={result.totalQuestions}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
              )
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] glass-card rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-2">No results yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
            Complete today's quiz to see your results here.
          </p>
          {!hasCompletedToday && (
            <Button asChild>
              <Link to="/">Go to Today's Quiz</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
