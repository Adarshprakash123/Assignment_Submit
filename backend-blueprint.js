
/*
This is a blueprint for how you would set up a Node.js/Express backend with MongoDB.
This would be in a separate repository from your React frontend.

Install the following packages:
- express
- mongoose
- cors
- dotenv
*/

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Question Schema
const questionSchema = new mongoose.Schema({
  id: String,
  text: String,
  options: [String],
  correctAnswer: String,
  day: String, // e.g., 'today', 'day-1', etc.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);

// Result Schema
const resultSchema = new mongoose.Schema({
  userId: String, // You would add authentication later
  dayId: String,
  score: Number,
  totalQuestions: Number,
  date: String,
  answers: Object, // Store user's answers
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const Result = mongoose.model('Result', resultSchema);

// Routes

// Get questions for a specific day
app.get('/api/questions/:dayId', async (req, res) => {
  try {
    const { dayId } = req.params;
    const questions = await Question.find({ day: dayId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Submit answers and get score
app.post('/api/answers', async (req, res) => {
  try {
    const { dayId, answers } = req.body;
    
    // Get questions for this day
    const questions = await Question.find({ day: dayId });
    
    // Calculate score
    let score = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    
    // Save result
    const result = new Result({
      userId: 'guest', // Replace with actual user ID when auth is added
      dayId,
      score,
      totalQuestions: questions.length,
      date: new Date().toISOString(),
      answers
    });
    
    await result.save();
    
    res.json({ 
      success: true, 
      score, 
      totalQuestions: questions.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get all results
app.get('/api/results', async (req, res) => {
  try {
    const results = await Result.find({ userId: 'guest' }).sort({ completedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get user's answers for a specific day
app.get('/api/answers/:dayId', async (req, res) => {
  try {
    const { dayId } = req.params;
    const result = await Result.findOne({ userId: 'guest', dayId });
    res.json(result ? result.answers : {});
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* 
To add new questions for additional days:

1. Connect to your MongoDB database
2. Insert new question documents:

Example:
db.questions.insertMany([
  {
    id: 'day-8-q1',
    text: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Rome'],
    correctAnswer: 'Paris',
    day: 'day-8'
  },
  {
    id: 'day-8-q2',
    text: 'What is 2+2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    day: 'day-8'
  },
  ...more questions
]);

You could also create an admin interface for adding new questions.
*/
