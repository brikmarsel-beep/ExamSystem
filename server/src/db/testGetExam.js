const pool = require('./connect.js');

async function getFirstExam() {
  try {
    console.log('🔍 Querying the database for the first exam...');
    const result = await pool.query('SELECT * FROM exams LIMIT 1');

    if (result.rows.length === 0) {
      console.log('⚠️ No exams found in the database. Please run the seed script first!');
    } else {
      const exam = result.rows[0];
      console.log('✅ Exam retrieved successfully:');
      console.log('--------------------------------------------------');
      console.log(`ID:            ${exam.id}`);
      console.log(`Title:         ${exam.title}`);
      console.log(`Time Limit:    ${exam.time_limit} minutes`);
      console.log(`Passing Grade: ${exam.passing_grade}`);
      console.log('');
      console.log('Nested Questions (JSONB parsed automatically by pg):');
      console.log(exam.questions);
      console.log('--------------------------------------------------');

      // Loop through questions
      console.log('📝 Looping through questions:');
      exam.questions.forEach((question, index) => {
        console.log(`\nQuestion ${index + 1}:`);
        console.log(`  ID: ${question.id}`);
        console.log(`  Text: ${question.text}`);
        console.log(`  Type: ${question.type}`);
        if (question.options) {
          console.log(`  Options: ${question.options.join(', ')}`);
          console.log(`  Answer: ${question.answer}`);
        }
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

getFirstExam();