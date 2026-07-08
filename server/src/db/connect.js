const { Pool } = require('pg');
require('dotenv').config();

const mode = process.env.DB_MODE || 'json';

let connectionString;

if (mode === 'render') {
  connectionString = process.env.RENDER_DATABASE_URL;
  console.log('🌐 Using REMOTE Render PostgreSQL database');
} else if (mode === 'docker') {
  connectionString = process.env.DOCKER_DATABASE_URL;
  console.log('🐳 Using LOCAL Docker PostgreSQL database');
} else {
  console.log('📄 Using JSON mock data');
  module.exports = null;
}

const pool = new Pool({
  connectionString,
  ssl: mode === 'render' ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('🗄️ Database connected successfully at: ' + new Date().toISOString()))
  .catch(err => console.error('❌ Database connection error:', err));

module.exports = pool;