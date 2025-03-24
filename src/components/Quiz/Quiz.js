import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import QuizQuestion from "./QuizQuestion";

const Quiz = () => {
  const [todaysQuestions, setTodaysQuestions] = useState([]);

  useEffect(() => {
    const fetchTodaysQuestions = async () => {
      const today = new Date().toISOString().split("T")[0];
      const questionsRef = collection(db, "questions");
      const q = query(
        questionsRef,
        where("date", "==", today),
        where("active", "==", true)
        
      );

      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTodaysQuestions(questions);
    };

    fetchTodaysQuestions();
  }, []);

  return (
    <div>
      <h2>Today's Quiz</h2>
      {todaysQuestions.length > 0 ? (
        todaysQuestions.map((question) => (
          <QuizQuestion key={question.id} question={question} />
        ))
      ) : (
        <p>No questions available for today.</p>
      )}
    </div>
  );
};

export default Quiz;
