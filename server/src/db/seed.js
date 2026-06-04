const pool = require('./connect.js');

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        role VARCHAR CHECK (role IN ('LECTURER', 'STUDENT')),
        name VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        time_limit INTEGER,
        passing_grade INTEGER,
        questions JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        exam_id UUID REFERENCES exams(id),
        student_id UUID REFERENCES users(id),
        score INTEGER,
        answers JSONB,
        submitted_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables created!');

    // Clear existing data
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM exams');
    await pool.query('DELETE FROM users');

    // Insert users
    await pool.query(`
      INSERT INTO users (username, password, role, name) VALUES
      ('teacher1', '1234', 'LECTURER', 'David Cohen'),
      ('student1', '1234', 'STUDENT', 'Yossi Levi'),
      ('student2', '1234', 'STUDENT', 'Sarah Mizrahi')
    `);

    console.log('✅ Users inserted!');

    // Insert exams with JSONB questions
    await pool.query(`
      INSERT INTO exams (title, time_limit, passing_grade, questions) VALUES
      ('JavaScript Basics', 60, 60, '[
        {
          "id": "q1",
          "text": "What is typeof null?",
          "type": "MULTIPLE_CHOICE",
          "answer": "object",
          "options": ["object", "null", "undefined"]
        },
        {
          "id": "q2",
          "text": "Explain Closures in JS.",
          "type": "OPEN_ENDED"
        }
      ]'),
      ('React Fundamentals', 45, 70, '[
        {
          "id": "q1",
          "text": "What is useState?",
          "type": "MULTIPLE_CHOICE",
          "answer": "A React hook",
          "options": ["A React hook", "A database", "A server", "A style"]
        },
        {
          "id": "q2",
          "text": "What is useEffect used for?",
          "type": "OPEN_ENDED"
        }
      ]')
    `);

    console.log('✅ Exams with JSONB questions inserted!');
    console.log('🎉 Seed completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();