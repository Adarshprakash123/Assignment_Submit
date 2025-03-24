import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase";
import QuizQuestion from "../Quiz/QuizQuestion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const History = () => {
  const { user } = useUser();
  const [attemptHistory, setAttemptHistory] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchAttemptHistory = async () => {
      try {
        const response = await axios.get("/api/user/history", {
          headers: {
            Authorization: `Bearer ${user.id}`,
          },
        });

        const { attempts, userAnswers } = response.data;
        setAttemptHistory(attempts);
        setUserAnswers(userAnswers);

        // Automatically select the most recent date for testing
        const dates = Object.keys(attempts);
        if (dates.length > 0) {
          setSelectedDate(dates[0]); // Select the first date for testing
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchAttemptHistory();
  }, [user]);

  return (
    <div>
      <h2>Quiz History</h2>
      {selectedDate && (
        <div className="history-day-section">
          <h3>Date: {selectedDate}</h3>
          {attemptHistory[selectedDate].map((questionId) => {
            const question = questions.find((q) => q.id === questionId);
            const userAnswer = userAnswers[`${selectedDate}_${questionId}`];

            if (!question) return null;

            return (
              <div key={questionId} className="history-question">
                <h4>{question.question}</h4>
                <div className="options">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`option ${
                        option === userAnswer ? "selected" : ""
                      } ${option === question.correctAnswer ? "correct" : ""}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <div className="result-info">
                  <p>Your answer: {userAnswer}</p>
                  <p>Correct answer: {question.correctAnswer}</p>
                  <p>
                    Status:{" "}
                    {userAnswer === question.correctAnswer
                      ? "✅ Correct"
                      : "❌ Incorrect"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!selectedDate && (
        <p>No quiz history available yet. Start attempting questions!</p>
      )}
    </div>
  );
};

export default History;
