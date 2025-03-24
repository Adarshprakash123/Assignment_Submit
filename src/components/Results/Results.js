import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase";

const Results = () => {
  const [results, setResults] = useState({
    total: 0,
    daily: {},
  });

  useEffect(() => {
    const fetchResults = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (userData?.results) {
        const dailyResults = userData.results;
        const total = Object.values(dailyResults).reduce(
          (sum, val) => sum + val,
          0
        );

        setResults({
          total: total || 0, // Ensure default is 0
          daily: dailyResults,
        });
      } else {
        // Initialize with default values if no results exist
        setResults({
          total: 0,
          daily: {},
        });
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2>Quiz Results</h2>
      <div>Total Correct Answers: {results.total}</div>
      <h3>Daily Results:</h3>
      {Object.entries(results.daily).map(([date, count]) => (
        <div key={date}>
          {date}: {count} correct answers
        </div>
      ))}
      {Object.keys(results.daily).length === 0 && (
        <p>No attempts yet. Start attempting questions to see your results!</p>
      )}
    </div>
  );
};

export default Results;
