const pool = require('../config/database');

/*
expect params in the request's body   
@ param 1: product name
@ param 2: product description (optional)
@ param 3: unit price (selling price)
@ param 4: registered_at
*/
exports.register = async (req, res) => {
  try {
    const { product_name, product_description, product_price } = req.body;
    // console.log(req.body)

    // Check the obligatory fields are in the body != null
    if (!product_name || (product_price == null ) || product_price <= 0.00) {
      return res
        .status(400)
        .send('Invalid input! Incorrect values (product_name or unit price).');
    };

  // execute the SQL query
    const [result] = await pool.query(
      'INSERT INTO Product(`product_name`, `product_price`) VALUES (?, ?)',
      [product_name, parseFloat(product_price).toFixed(2)]
    );
    
    // get the product_id to insert the product_description
    const product_id = result.insertId; 
    if (product_description) {
      await pool.query(
      'INSERT INTO Product_Description(`product_id`, `product_description`) VALUES (?, ?)',
      [product_id, product_description]
      );  
    }


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

/*
  @ no params, it requires to be authenticated
  @ JWT token into the request's header
*/
exports.getCurrentStock = async(req, res) => {
  try{
    const [response] = await pool.query(
      `SELECT * FROM v_current_stock;`
    );
    console.log(response)
    return res.status(201).json({ message: 'Information Fetched Successfully', data: response });
  } catch( error ){
    console.log(error)
    return res.status(401).send('Unauthorized Access');
  }
}