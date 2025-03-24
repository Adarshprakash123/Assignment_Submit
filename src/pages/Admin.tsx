import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  day: string;
}

const AdminPage = () => {
  const { user, isSignedIn } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentDay, setCurrentDay] = useState("today");
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  // In a real implementation, you would check if the user has admin rights
  const isAdmin = isSignedIn && user?.isAdmin; // This is a simplification - you would check for admin role in a real app

  useEffect(() => {
    // This would fetch from your MongoDB in production
    const fetchQuestions = async () => {
      setLoading(true);
      // In a real implementation, this would be an API call
      const storedQuestions = localStorage.getItem(
        `admin-questions-${currentDay}`
      );
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      } else {
        // Default empty array
        setQuestions([]);
      }
      setLoading(false);
    };

    if (isAdmin) {
      fetchQuestions();
    }
  }, [currentDay, isAdmin]);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    });
  };

  const handleAddQuestion = () => {
    if (
      !newQuestion.text ||
      newQuestion.options.some((opt) => !opt) ||
      !newQuestion.correctAnswer
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and select a correct answer.",
        variant: "destructive",
      });
      return;
    }

    const questionId = `${currentDay}-q${questions.length + 1}`;
    const newQuestionItem: Question = {
      id: questionId,
      text: newQuestion.text,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      day: currentDay,
    };

    const updatedQuestions = [...questions, newQuestionItem];
    setQuestions(updatedQuestions);

    // Save to localStorage (in production this would be saved to MongoDB)
    localStorage.setItem(
      `admin-questions-${currentDay}`,
      JSON.stringify(updatedQuestions)
    );

    // Reset form
    setNewQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });

    toast({
      title: "Question Added",
      description: `New question added to ${currentDay}.`,
    });
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem(
      `admin-questions-${currentDay}`,
      JSON.stringify(updatedQuestions)
    );

    toast({
      title: "Question Deleted",
      description: `Question removed from ${currentDay}.`,
    });
  };

  const handlePublish = () => {
    // In a real implementation, this would update the database
    // For now, we'll just show a success message
    toast({
      title: "Questions Published",
      description: `${questions.length} questions published for ${currentDay}.`,
    });
  };

  if (!isAdmin) {
    return (
      <div className="page-container pt-24 pb-16 animate-fade-in">
        <div className="flex flex-col items-center justify-center min-h-[300px] glass-card rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-2">Admin Access Required</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
            You need admin access to manage questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pt-24 pb-16 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage quiz questions for each day.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-48">
          <Select value={currentDay} onValueChange={setCurrentDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              {Array.from({ length: 14 }).map((_, i) => (
                <SelectItem key={i} value={`day-${i + 1}`}>
                  Day {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handlePublish} disabled={questions.length === 0}>
          Publish Questions
        </Button>
      </div>

      <div className="glass-card p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Question</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Question Text
            </label>
            <Textarea
              value={newQuestion.text}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, text: e.target.value })
              }
              placeholder="Enter your question here..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setNewQuestion({ ...newQuestion, correctAnswer: option })
                    }
                    className={
                      newQuestion.correctAnswer === option
                        ? "border-green-500"
                        : ""
                    }
                  >
                    {newQuestion.correctAnswer === option ? "✓" : "Set Correct"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAddQuestion}>Add Question</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Current Questions ({currentDay})
        </h2>

        {loading ? (
          <div className="text-center py-8">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 glass-card rounded-xl">
            No questions added for this day yet.
          </div>
        ) : (
          <Table>
            <TableCaption>List of questions for {currentDay}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-[150px]">Correct Answer</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow key={question.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{question.text}</TableCell>
                  <TableCell>{question.correctAnswer}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
