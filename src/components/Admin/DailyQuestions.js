import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "../../firebase";

const DailyQuestions = () => {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add to questions collection with date
      const questionsRef = collection(db, "questions");
      await addDoc(questionsRef, {
        ...newQuestion,
        createdAt: serverTimestamp(),
        active: true,
      });

      toast.success("Question added successfully");
      // Reset form
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast.error("Error adding question");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Daily Question</h2>
      <div>
        <label>Question:</label>
        <input
          type="text"
          value={newQuestion.question}
          onChange={(e) =>
            setNewQuestion({
              ...newQuestion,
              question: e.target.value,
            })
          }
          required
        />
      </div>

      <div>
        <label>Options:</label>
        {newQuestion.options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...newQuestion.options];
              newOptions[index] = e.target.value;
              setNewQuestion({
                ...newQuestion,
                options: newOptions,
              });
            }}
            required
          />
        ))}
      </div>

      <div>
        <label>Correct Answer:</label>
        <select
          value={newQuestion.correctAnswer}
          onChange={(e) =>
            setNewQuestion({
              ...newQuestion,
              correctAnswer: e.target.value,
            })
          }
          required
        >
          <option value="">Select correct answer</option>
          {newQuestion.options.map(
            (option, index) =>
              option && (
                <option key={index} value={option}>
                  {option}
                </option>
              )
          )}
        </select>
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          value={newQuestion.date}
          onChange={(e) =>
            setNewQuestion({
              ...newQuestion,
              date: e.target.value,
            })
          }
          required
        />
      </div>

      <button type="submit">Add Question</button>
    </form>
  );
};

export default DailyQuestions;
