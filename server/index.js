const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

// Routes for authentication login/register
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stockRoutes');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/auth', authRoutes);
app.use('/stock', stockRoutes);

// Running server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});