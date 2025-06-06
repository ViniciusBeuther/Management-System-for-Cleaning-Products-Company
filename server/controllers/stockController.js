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

/*
  @ no params, it requires to be authenticated
  @ JWT Token into the request's header

  End point used to list all the products that are registered into the inventory
*/
exports.listRegisteredProducts = async(req, res) => {
  try {
    const [response] = await pool.query(
        'SELECT * FROM list_registered_products;'
    );

    console.log(response);

    return res.status(200).json({ message: 'Information Fetched Successfully', data: response })
  } catch(error) {
    console.log(error);
    return res.status(401).send('Unauthorized Access')
  }
};

/*
  Expect params in body of the HTTP request (updated object)
  @param 1: product_id
  @param 2: product_name
  @param 3: product_price (just the amount, without currency symbol)
  @param 4: description (optional)
*/
exports.updateRegisteredItem = async(req, res) => {
  try{
    const { product_id, product_name, product_price, product_description } = req.body;
    const price = product_price.replace(/^R\$ ([0-9]+\.[0-9]+)$/g, '$1');
    console.log(`updated price, only numbers: ${price}`);

    if( !product_name || !product_price || product_price < 0.00){
      return res.status(400).send('Request must include the updated product_name and product_price, price must be positive.');
    }

    if (product_description !== undefined && product_description !== null) {
      // Check if there's a record in description database with the product_id provided
      const [existsInDb] = await pool.query(
      'SELECT COUNT(1) AS count FROM Product_Description WHERE product_id = ?;',
      [product_id]
      );

      console.log(`existsInDb = ${existsInDb[0].count}`)

      if (product_description.trim() == '') {
        // User removed description but the item exists in db
        if (existsInDb[0].count > 0) {
          await pool.query(
            'DELETE FROM Product_Description WHERE product_id = ?;',
            [product_id]
          );
        }
      } else {
        // Handling item if it doesn't registered yet in the description db
        // Update the currently product description
        if (existsInDb[0].count > 0) {
        await pool.query(
          'UPDATE Product_Description SET product_description = ? WHERE product_id = ?;',
          [product_description, product_id]
        );
        } 
        // create one description if it doesn't exist yet
        else {
        await pool.query(
          'INSERT INTO Product_Description (product_id, product_description) VALUES (?, ?);',
          [product_id, product_description]
        );
        }
      }
  
      // Updated the product table with the latest info provided
      const [result] = await pool.query(
        'UPDATE Product SET product_name = ?, product_price = ? WHERE product_id = ?;',
        [product_name, price, product_id]
      );
      }

    
    return(res.status(202).json({message: "Success, product updated.", success: true}));

  } catch( error ){
    console.log(`Error updated: ${error}`);
    return(res.status(500).json({message: "An error occurred updating the product.", success: false}));
  }
}

exports.deleteRegisteredItem = async (req, res) => {
  try{
    const { product_id } = req.body;
    
    await pool.query(
      'DELETE FROM Product_Description WHERE product_id = ?;', [product_id]
    );
    
    await pool.query(
      'DELETE FROM Product WHERE product_id = ?;', [product_id]
    );

    return res.status(202).json({message: "Success, product deleted.", success: true});
  } catch( error ) {
    console.log(`Error deleting product: ${error}`);
    return res.status(500).json({message: `An error occurred deleting the product: ${error}`, success: false});
  }
};