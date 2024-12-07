const bcrypt = require('bcryptjs');
const pool = require('../config/database');

class User{
  constructor(username, email, password){
    this.username = username;
    this.email = email;
    this.password = password;
  }

  async createUser() {    
    const [rows] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [this.username, this.email, this.password]
    );
    return rows;
  }

}

module.exports = User;