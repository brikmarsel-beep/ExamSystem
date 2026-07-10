const pool = require('./connect.js');

async function getAll() {
  try {
    console.log('👥 Getting all users...');
    const users = await pool.query('SELECT id, username, role, name FROM users');
    console.log('✅ Users:');
    users.rows.forEach(user => {
      console.log(`  - ${user.name} (${user.role}) - ${user.username}`);
    });

    console.log('');
    console.log('📚 Getting all exams...');
    const exams = await pool.query('SELECT id, title, time_limit, passing_grade FROM exams');
    console.log('✅ Exams:');
    exams.rows.forEach(exam => {
      console.log(`  - ${exam.title} | Time: ${exam.time_limit}min | Pass: ${exam.passing_grade}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

getAll();