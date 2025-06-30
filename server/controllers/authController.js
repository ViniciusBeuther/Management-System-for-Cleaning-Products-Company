const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO User(username, password) VALUES(?,?)';    
    pool.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.status(201).send('User created successfully!');
    });
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
}

/**
 * Logs in a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.login = async (req, res) => {
  try {
    // validate the input request
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }

    // Query in database
    const [users] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);

    // Check if the user exists
    if (users.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = users[0];

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      // console.log(process.env.JWT_SECRET)
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1/10h' });
      return res.json({ message: 'Success, logged in!', token });
    } else {
      return res.status(403).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('An error occurred during login.');
  }
}