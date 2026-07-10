const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock exams
const exams = [
  {
    id: 1,
    title: "JavaScript Basics",
    teacherId: 1,
    status: "active",
    duration: 30,
    questions: [
      { id: 1, text: "What is typeof null?", options: ["object", "null", "undefined"], correct: 0 },
      { id: 2, text: "What does === mean?", options: ["Assignment", "Strict equality", "Not equal"], correct: 1 },
    ],
  },
  {
    id: 2,
    title: "React Fundamentals",
    teacherId: 1,
    status: "draft",
    duration: 45,
    questions: [
      { id: 1, text: "What is useState?", options: ["A hook", "A database", "A server"], correct: 0 },
    ],
  },
];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'exam-service', port: 3002 });
});

app.get('/', (req, res) => {
  console.log('📚 Getting all exams');
  res.json(exams);
});

app.get('/:id', (req, res) => {
  const exam = exams.find(e => e.id === parseInt(req.params.id));
  if (exam) {
    console.log(`📖 Getting exam: ${exam.title}`);
    res.json(exam);
  } else {
    res.status(404).json({ message: 'Exam not found' });
  }
});

app.post('/', (req, res) => {
  const { title, teacherId, duration } = req.body;
  const newExam = {
    id: exams.length + 1,
    title,
    teacherId,
    status: 'draft',
    duration,
    questions: [],
  };
  exams.push(newExam);
  console.log(`✅ Created exam: ${title}`);
  res.json(newExam);
});

app.patch('/:id/status', (req, res) => {
  const exam = exams.find(e => e.id === parseInt(req.params.id));
  if (exam) {
    exam.status = req.body.status;
    console.log(`🔄 Status changed: ${exam.title} -> ${exam.status}`);
    res.json(exam);
  } else {
    res.status(404).json({ message: 'Exam not found' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`📚 Exam Service running on http://localhost:${PORT}`);
});