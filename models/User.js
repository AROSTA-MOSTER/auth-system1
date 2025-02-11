const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  async create(username, password, email) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email]
    );
    return result.rows[0]; // Return the newly created user
  },

  // Find a user by username
  async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0]; // Return the user if found, otherwise null
  },

  // Find a user by ID
  async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0]; // Return the user if found, otherwise null
  },
};

module.exports = User;