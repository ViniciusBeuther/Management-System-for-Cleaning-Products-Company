const pool = require('../config/database');

exports.register = async (req, res) => {
  try {
    const { name, description, quantityInStock, unitPrice, registered_at } = req.body;
    // console.log(`name: ${typeof(name)}`);
    // console.log(`description: ${typeof(description)}`);
    // console.log(`stockQuantity: ${typeof(quantityInStock)}`);
    // console.log(`UnitPrice: ${typeof(unitPrice)}`);

    // Check the obligatory fields are in the body != null
    if (!name || quantityInStock == null || unitPrice == null) {
      return res
        .status(400)
        .send('Name, quantity in stock, and unit price are obligatory!');
    }

  // execute the SQL query
    const [result] = await pool.query(
      'INSERT INTO products(`name`, `description`, `price`, `stock_quantity`, `registered_at`) VALUES (?, ?, ?, ?, ?)',
      [name, description, parseFloat(unitPrice), parseInt(quantityInStock), registered_at]
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
