
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionList from '@/components/questions/QuestionList';
import { historyData, getSavedAnswers, HISTORY_DAYS } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const History = () => {
  const [activeDay, setActiveDay] = useState<string>('day-1');
  const [savedAnswers, setSavedAnswers] = useState<Record<string, Record<string, string>>>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [visibleDays, setVisibleDays] = useState<number>(7); // Show 7 days initially
  const { isSignedIn, user } = useUser();
  
  useEffect(() => {
    // Load saved answers for all historical days
    const allAnswers: Record<string, Record<string, string>> = {};
    const userId = isSignedIn && user ? user.id : 'guest';
    
    historyData.forEach((day) => {
      const dayId = day.date.includes('day-') ? day.date : `day-${historyData.indexOf(day) + 1}`;
      allAnswers[dayId] = getSavedAnswers(dayId, userId);
    });
    
    setSavedAnswers(allAnswers);
  }, [isSignedIn, user]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Calculate which day this corresponds to
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= HISTORY_DAYS) {
        setActiveDay(`day-${diffDays}`);
      }
    }
  };
  
  const showMoreDays = () => {
    setVisibleDays(HISTORY_DAYS);
  };
  
  return (
    <div className="page-container pt-24 pb-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Previous Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review questions and answers from previous days.
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Tabs defaultValue={activeDay} value={activeDay} onValueChange={setActiveDay} className="w-full">
        <TabsList className="mb-8 overflow-x-auto flex w-full h-auto py-2 justify-start sm:justify-start">
          {historyData.slice(0, visibleDays).map((day, index) => (
            <TabsTrigger 
              key={index} 
              value={`day-${index+1}`}
              className="px-4 py-2 min-w-[100px] data-[state=active]:text-primary data-[state=active]:bg-primary/10"
            >
              Day {index+1}
            </TabsTrigger>
          ))}
          {visibleDays < HISTORY_DAYS && (
            <Button variant="ghost" onClick={showMoreDays} className="min-w-[100px]">
              Show More...
            </Button>
          )}
        </TabsList>
        
        {historyData.map((day, index) => {
          const dayId = `day-${index+1}`;
          return (
            <TabsContent key={index} value={dayId} className="mt-0">
              <QuestionList
                questions={day.questions}
                date={day.date}
                allowSubmit={false}
                savedAnswers={savedAnswers[dayId] || {}}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default History;
