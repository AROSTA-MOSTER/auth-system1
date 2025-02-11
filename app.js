require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authenticateJWT = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));