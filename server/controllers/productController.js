const pool = require('../config/database');

exports.register = async (req, res) => {
  try {
    const { name, description, stockQuantity, unitPrice } = req.body;

    // Check the obligatory fields are in the body != null
    if (!name || stockQuantity == null || unitPrice == null) {
      return res
        .status(400)
        .send('Name, quantity in stock, and unit price are obligatory!');
    }

  // execute the SQL query
    const [result] = await pool.query(
      'INSERT INTO products(name, description, unit_price, stock_quantity) VALUES (?, ?, ?, ?)',
      [name, description, unitPrice, stockQuantity]
    );

    // Returns the response, the product id
    return res
      .status(201)
      .json({ message: 'Product inserted successfully!', productId: result.insertId });
  } catch (error) {
    console.error('Error inserting product:', error.message);

    // Return server error if it fails
    return res.status(500).send('An error occurred while inserting the product.');
  }
};
