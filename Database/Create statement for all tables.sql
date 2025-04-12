CREATE DATABASE mei_system_db;
use mei_system_db;

CREATE TABLE IF NOT EXISTS Product(
	product_id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL UNIQUE,
    product_price DECIMAL(7,2) NOT NULL,
		CHECK(product_price > 0),
    registered_at DATE NOT NULL DEFAULT(CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS Product_Description(
	product_id INT NOT NULL,
    product_description VARCHAR(500) NOT NULL,
    PRIMARY KEY(product_id, product_description),
    FOREIGN KEY(product_id) REFERENCES Product(product_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Supplier(
	supplier_id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT, 
    company_name VARCHAR(100) NOT NULL UNIQUE,
    supplier_telephone VARCHAR(12) NOT NULL,
    supplier_email VARCHAR(100) NOT NULL
		CHECK(supplier_email REGEXP '.*\@.*')
);

CREATE TABLE IF NOT EXISTS Status(
	status_id INT AUTO_INCREMENT NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY(status_id, status)
);

-- NOT USED --
CREATE TABLE IF NOT EXISTS Order_Status(
	order_status_id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    status_id INT NOT NULL,
    order_id INT NOT NULL,
    FOREIGN KEY(status_id) REFERENCES Status(status_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
	FOREIGN KEY(order_id) REFERENCES Orders(order_id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);
-- -------------------------------

CREATE TABLE IF NOT EXISTS Orders(
	order_id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    order_status_id INT NOT NULL,
    order_date DATE NOT NULL DEFAULT(CURRENT_DATE),
    FOREIGN KEY(order_status_id) REFERENCES Status(status_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Entry_Order(
	entry_order_id INT NOT NULL UNIQUE,
    supplier_id INT NOT NULL,
    PRIMARY KEY(entry_order_id, supplier_id),
    FOREIGN KEY(supplier_id) REFERENCES Supplier(supplier_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
	FOREIGN KEY(entry_order_id) REFERENCES Orders(order_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Exit_Order(
	exit_order_id INT NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    PRIMARY KEY(exit_order_id, customer_id),
    FOREIGN KEY(customer_id) REFERENCES Customer(customer_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
	FOREIGN KEY(exit_order_id) REFERENCES Orders(order_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS Order_Item(
	product_id INT NOT NULL,
    order_id INT NOT NULL,
    quantity SMALLINT NOT NULL,
		CHECK(quantity > 0),
    unit_price DECIMAL(7,2) NOT NULL,
		CHECK(unit_price > 0.00),
    PRIMARY KEY(product_id, order_id),
    FOREIGN KEY(product_id) REFERENCES Product(product_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
	FOREIGN KEY(order_id) REFERENCES Orders(order_id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Bill_Type(
	bill_type_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    bill_type VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY(bill_type_id, bill_type)
);

CREATE TABLE IF NOT EXISTS Bill(
	bill_id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    bill_type_id INT NOT NULL,
    
    registered_at DATE NOT NULL DEFAULT(CURRENT_DATE),
    bill_price DECIMAL(7,2) NOT NULL,
		CHECK(bill_price > 0.00),
    FOREIGN KEY(bill_type_id) REFERENCES Bill_Type(bill_type_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Bill_Status(
	bill_status_id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    bill_id INT NOT NULL,
    status_id INT NOT NULL,
    bill_status_date DATE NOT NULL DEFAULT(CURRENT_DATE),
	FOREIGN KEY(status_id) REFERENCES Status(status_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
	FOREIGN KEY(bill_id) REFERENCES Bill(bill_id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Person(
	person_id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    document_number VARCHAR(12) NOT NULL,
    telephone VARCHAR(12) NOT NULL,
    email VARCHAR(100) NOT NULL,
		CHECK(email REGEXP '.*\@.*')
);

CREATE TABLE IF NOT EXISTS Country(
	country_id INT AUTO_INCREMENT NOT NULL UNIQUE PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS City(
	city_id INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY(country_id) REFERENCES Country(country_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Street(
	street_id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    street_name VARCHAR(100) NOT NULL,
    city_id INT NOT NULL,
    FOREIGN KEY(city_id) REFERENCES City(city_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
    );
    
CREATE TABLE IF NOT EXISTS Address(
	address_id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    street_id INT NOT NULL,
    number SMALLINT NOT NULL,
		CHECK(number >= 0),
    postal_code VARCHAR(15) NOT NULL,
    FOREIGN KEY(street_id) REFERENCES Street(street_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Customer(
	customer_id INT NOT NULL UNIQUE,
    address_id INT NOT NULL,
    PRIMARY KEY(customer_id, address_id),
    FOREIGN KEY(customer_id) REFERENCES Person(person_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE,
	FOREIGN KEY(address_id) REFERENCES Address(address_id)
		ON DELETE RESTRICT
        ON UPDATE CASCADE
);

drop table Customer;

select * from user;
CREATE TABLE User(
	user_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);