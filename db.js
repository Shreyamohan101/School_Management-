const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const createSchoolsTable = async () => {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const connection = await pool.getConnection();
    await connection.query(createTableSQL);
    connection.release();
    console.log(' Schools table created or already exists.');
  } catch (error) {
    console.error(' Error creating schools table:', error);
    throw error; s
  }
};

const initDB = async () => {
  try {
    await createSchoolsTable();
  } catch (error) {
    console.error(' Database initialization error:', error);
    throw error;
  }
};

module.exports = { pool, initDB };
