const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ExamSystem Gateway is running!',
    services: {
      auth: 'http://auth-service:3001',
      exam: 'http://exam-service:3002',
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'gateway', port: 3000 });
});

// Proxy to auth service
app.use('/api/auth', async (req, res) => {
  try {
    const url = `http://auth-service:3001${req.path}`;
    const response = await fetch(url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Auth service unavailable' });
  }
});

// Proxy to exam service
app.use('/api/exams', async (req, res) => {
  try {
    const url = `http://exam-service:3002${req.path}`;
    const response = await fetch(url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Exam service unavailable' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌐 Gateway running on http://localhost:${PORT}`);
});