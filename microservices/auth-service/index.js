const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock users
const users = [
  { id: 1, name: "David Cohen", email: "teacher@test.com", password: "1234", role: "teacher" },
  { id: 2, name: "Yossi Levi", email: "student@test.com", password: "1234", role: "student" },
];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service', port: 3001 });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    console.log(`✅ Login success: ${user.name}`);
    res.json({ success: true, user: safeUser });
  } else {
    console.log(`❌ Login failed for: ${email}`);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = users.find(u => u.email === email);
  if (exists) {
    res.status(400).json({ success: false, message: 'Email already exists' });
  } else {
    const newUser = { id: users.length + 1, name, email, password, role };
    users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    console.log(`✅ Register success: ${name}`);
    res.json({ success: true, user: safeUser });
  }
});

app.get('/users', (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
});