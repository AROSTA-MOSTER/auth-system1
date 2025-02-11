const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // For JWT token generation
const bcrypt = require('bcryptjs'); // For password hashing and comparison

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new user with hashed password
    const newUser = await User.create(username, password, email);

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
  try {
    // The user ID is attached to the request object by the JWT middleware
    const userId = req.user.userId;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user profile (excluding the password)
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};