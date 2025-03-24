import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { auth } from "../../firebase";

const QuizQuestion = ({ question, isHistory = false }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    // Check if user has attempted this question today
    const checkAttemptStatus = async () => {
      const today = new Date().toISOString().split("T")[0];
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const todaysAttempts = userDoc.data()?.attempts?.[today] || [];
      setHasAttempted(todaysAttempts.includes(question.id));
    };
    checkAttemptStatus();
  }, [question.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const userRef = doc(db, "users", auth.currentUser.uid);

    // Record the attempt and user's answer
    await updateDoc(userRef, {
      [`attempts.${today}`]: arrayUnion(question.id),
      [`userAnswers.${today}_${question.id}`]: selectedOption,
      [`results.${today}`]: increment(
        selectedOption === question.correctAnswer ? 1 : 0
      ),
    });

    setHasAttempted(true);
    // ... rest of submission handling
  };

  // Don't render submit functionality in history view
  if (isHistory) {
    return (
      <div>
        <h3>{question.question}</h3>
        <p>Your previous attempt:</p>
        {/* Show only the question and previous attempt */}
      </div>
    );
  }

  return (
    <div>
      <h3>{question.question}</h3>
      <form onSubmit={handleSubmit}>
        {question.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              name="option"
              value={option}
              onChange={(e) => setSelectedOption(e.target.value)}
              disabled={hasAttempted}
            />
            <label>{option}</label>
          </div>
        ))}
        <button type="submit" disabled={hasAttempted || !selectedOption}>
          {hasAttempted ? "Already Attempted" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default QuizQuestion;
