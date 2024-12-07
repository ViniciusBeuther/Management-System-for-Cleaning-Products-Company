const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const pool = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/users', authRoutes);

// Running server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});