const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mock Database
const db = {
  users: [
    { id: 1, name: "David Cohen", email: "teacher@test.com", password: "1234", role: "teacher" },
    { id: 2, name: "Yossi Levi", email: "student@test.com", password: "1234", role: "student" },
  ],
  exams: [
    {
      id: 1,
      title: "JavaScript Basics",
      teacherId: 1,
      status: "active",
      duration: 30,
      questions: [
        { id: 1, text: "What is a variable?", options: ["A container for data", "A function", "A loop", "A class"], correct: 0 },
        { id: 2, text: "What does === mean?", options: ["Assignment", "Strict equality", "Not equal", "Greater than"], correct: 1 },
      ],
    },
  ],
  submissions: [],
};

// AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } else {
    res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = db.users.find(u => u.email === email);
  if (exists) {
    res.status(400).json({ success: false, message: 'אימייל כבר קיים במערכת' });
  } else {
    const newUser = { id: db.users.length + 1, name, email, password, role };
    db.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    res.json({ success: true, user: safeUser });
  }
});

// EXAM ROUTES
app.get('/api/exams', (req, res) => {
  res.json(db.exams);
});

app.get('/api/exams/:id', (req, res) => {
  const exam = db.exams.find(e => e.id === parseInt(req.params.id));
  if (exam) {
    res.json(exam);
  } else {
    res.status(404).json({ message: 'מבחן לא נמצא' });
  }
});

app.get('/api/exams/teacher/:teacherId', (req, res) => {
  const exams = db.exams.filter(e => e.teacherId === parseInt(req.params.teacherId));
  res.json(exams);
});

app.post('/api/exams', (req, res) => {
  const { title, teacherId, duration } = req.body;
  const newExam = {
    id: db.exams.length + 1,
    title,
    teacherId,
    status: 'draft',
    duration,
    questions: [],
  };
  db.exams.push(newExam);
  res.json(newExam);
});

app.put('/api/exams/:id', (req, res) => {
  const index = db.exams.findIndex(e => e.id === parseInt(req.params.id));
  if (index !== -1) {
    db.exams[index] = { ...db.exams[index], ...req.body };
    res.json(db.exams[index]);
  } else {
    res.status(404).json({ message: 'מבחן לא נמצא' });
  }
});

app.post('/api/exams/:id/questions', (req, res) => {
  const exam = db.exams.find(e => e.id === parseInt(req.params.id));
  if (exam) {
    const newQuestion = { id: exam.questions.length + 1, ...req.body };
    exam.questions.push(newQuestion);
    res.json(exam);
  } else {
    res.status(404).json({ message: 'מבחן לא נמצא' });
  }
});

app.patch('/api/exams/:id/status', (req, res) => {
  const exam = db.exams.find(e => e.id === parseInt(req.params.id));
  if (exam) {
    exam.status = req.body.status;
    res.json(exam);
  } else {
    res.status(404).json({ message: 'מבחן לא נמצא' });
  }
});

// SUBMISSIONS
app.post('/api/submissions', (req, res) => {
  const { examId, studentId, answers } = req.body;
  const exam = db.exams.find(e => e.id === parseInt(examId));
  if (exam) {
    let score = 0;
    exam.questions.forEach((q, index) => {
      if (answers[index] === q.correct) score++;
    });
    const percentage = Math.round((score / exam.questions.length) * 100);
    const submission = {
      id: db.submissions.length + 1,
      examId,
      studentId,
      answers,
      score: percentage,
      passed: percentage >= 60,
      submittedAt: new Date().toISOString(),
    };
    db.submissions.push(submission);
    res.json(submission);
  } else {
    res.status(404).json({ message: 'מבחן לא נמצא' });
  }
});

app.get('/api/submissions/student/:studentId', (req, res) => {
  const submissions = db.submissions.filter(
    s => s.studentId === parseInt(req.params.studentId)
  );
  res.json(submissions);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});