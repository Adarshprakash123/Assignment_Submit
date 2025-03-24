
import { Question } from "@/components/questions/QuestionCard";

// Helper to generate a date string for N days ago
export const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Generate mock questions
export const generateQuestions = (count: number, seedPrefix: string): Question[] => {
  const questions: Question[] = [];
  
  const questionTemplates = [
    "What is the capital of {country}?",
    "Which planet is known as the {nickname}?",
    "Who painted {painting}?",
    "In which year did {event} occur?",
    "What is the chemical symbol for {element}?",
    "Which country has the largest {feature}?",
    "What is the main ingredient in {dish}?",
    "Who wrote the novel {book}?",
    "Which animal is known as the {animal nickname}?",
    "What is the currency of {country}?"
  ];
  
  const optionsTemplates = [
    ["Paris", "London", "Berlin", "Rome"],
    ["Mercury", "Venus", "Mars", "Jupiter"],
    ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
    ["1776", "1812", "1945", "1969"],
    ["O", "H", "C", "Na"],
    ["Russia", "China", "USA", "Brazil"],
    ["Rice", "Wheat", "Potatoes", "Corn"],
    ["Jane Austen", "Charles Dickens", "Mark Twain", "J.K. Rowling"],
    ["Lion", "Tiger", "Eagle", "Dolphin"],
    ["Euro", "Dollar", "Pound", "Yen"]
  ];
  
  for (let i = 0; i < count; i++) {
    const templateIndex = i % questionTemplates.length;
    const question: Question = {
      id: `${seedPrefix}-q${i+1}`,
      text: questionTemplates[templateIndex].replace(/\{.*?\}/, `#${i+1}`),
      options: [...optionsTemplates[templateIndex]],
      correctAnswer: optionsTemplates[templateIndex][Math.floor(Math.random() * 4)]
    };
    
    // Shuffle options
    for (let j = question.options.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [question.options[j], question.options[k]] = [question.options[k], question.options[j]];
    }
    
    questions.push(question);
  }
  
  return questions;
};

// Generate today's questions
export const todaysQuestions = generateQuestions(10, 'today');

// Define the number of historical days to generate
export const HISTORY_DAYS = 14; // Increased from 7 to 14 days

// Generate history data for past days
export const historyData = Array.from({ length: HISTORY_DAYS }).map((_, index) => {
  return {
    date: getDateString(index + 1),
    questions: generateQuestions(10, `day-${index+1}`),
    userAnswers: {} as Record<string, string>
  };
});

// Generate mock results data
export const generateResultsData = () => {
  return [
    {
      id: 'today',
      title: "Today's Quiz",
      date: getDateString(0),
      score: 0, 
      totalQuestions: todaysQuestions.length,
      isCompleted: false,
      userId: 'guest' // Default guest ID
    },
    ...Array.from({ length: HISTORY_DAYS }).map((_, index) => {
      const score = Math.floor(Math.random() * 10) + 1;
      return {
        id: `day-${index+1}`,
        title: `Day ${index+1} Quiz`,
        date: getDateString(index + 1),
        score,
        totalQuestions: 10,
        isCompleted: true,
        userId: 'guest' // Default guest ID
      };
    })
  ];
};

export const resultsData = generateResultsData();

// Storage functions to simulate backend
export const saveAnswers = (dayId: string, answers: Record<string, string>, userId = 'guest') => {
  localStorage.setItem(`quiz-answers-${dayId}-${userId}`, JSON.stringify(answers));
  
  // Calculate score
  let questionsForDay;
  if (dayId === 'today') {
    questionsForDay = todaysQuestions;
  } else {
    const dayIndex = parseInt(dayId.replace('day-', '')) - 1;
    if (dayIndex >= 0 && dayIndex < historyData.length) {
      questionsForDay = historyData[dayIndex].questions;
    }
  }
  
  if (questionsForDay) {
    let score = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questionsForDay.find(q => q.id === questionId);
      if (question && question.correctAnswer === answer) {
        score++;
      }
    });
    
    // Update results
    const results = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    const resultIndex = results.findIndex((r: any) => r.id === dayId && r.userId === userId);
    
    if (resultIndex >= 0) {
      results[resultIndex].score = score;
      results[resultIndex].isCompleted = true;
    } else {
      results.unshift({
        id: dayId,
        title: dayId === 'today' ? "Today's Quiz" : `${dayId} Quiz`,
        date: dayId === 'today' ? getDateString(0) : getDateString(parseInt(dayId.replace('day-', ''))),
        score,
        totalQuestions: questionsForDay.length,
        isCompleted: true,
        userId
      });
    }
    
    localStorage.setItem('quiz-results', JSON.stringify(results));
    return score;
  }
  
  return 0;
};

export const getSavedAnswers = (dayId: string, userId = 'guest'): Record<string, string> => {
  const saved = localStorage.getItem(`quiz-answers-${dayId}-${userId}`);
  return saved ? JSON.parse(saved) : {};
};

export const getSavedResults = (userId = 'guest') => {
  const saved = localStorage.getItem('quiz-results');
  if (saved) {
    const allResults = JSON.parse(saved);
    return allResults.filter((result: any) => result.userId === userId || result.userId === 'guest');
  }
  return resultsData;
};
