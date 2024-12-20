exports.register = async (req, res) => {
  try {
    const { name, description, quantityInStock, unitPrice } = req.body;

    // Check the obligatory fields are in the body != null
    if (!name || quantityInStock == null || unitPrice == null) {
      return res
        .status(400)
        .send('Name, quantity in stock, and unit price are obligatory!');
    }

    const date = new Date();
    const registered_at = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  // execute the SQL query
    const [result] = await pool.query(
      'INSERT INTO products(name, description, quantityInStock, unitPrice) VALUES (?, ?, ?, ?)',
      [name, description, quantityInStock, unitPrice]
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
