
// This file would contain API calls to your MongoDB backend

// Define the Question interface
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  day: string;
}

// Example interface for our API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// URL to your backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch function with error handling
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || 'An error occurred with the API request' 
      };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get questions for a specific day
export async function fetchQuestions(dayId: string) {
  return fetchApi<Question[]>(`/questions/${dayId}`);
}

// Submit user's answers
export async function submitAnswers(dayId: string, answers: Record<string, string>) {
  return fetchApi<{ score: number, totalQuestions: number }>('/answers', {
    method: 'POST',
    body: JSON.stringify({ dayId, answers }),
  });
}

// Get user's previous results
export async function fetchResults() {
  return fetchApi<any[]>('/results');
}

// Get user's previous answers for a day
export async function fetchUserAnswers(dayId: string) {
  return fetchApi<Record<string, string>>(`/answers/${dayId}`);
}

export default {
  fetchQuestions,
  submitAnswers,
  fetchResults,
  fetchUserAnswers
};
