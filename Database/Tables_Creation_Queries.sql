CREATE DATABASE MEI_management_system;
USE MEI_management_system;

## Table to store products
CREATE TABLE PRODUCTS(
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100),
    price FLOAT NOT NULL CHECK(price > 0),
    stock_quantity INT NOT NULL CHECK(stock_quantity >= 0),
    registered_at DATE NOT NULL
);

## Table to store clients
CREATE TABLE CLIENTS (
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL, 
    state VARCHAR(100) NOT NULL, 
    zip VARCHAR(100) NOT NULL CHECK(zip REGEXP '[0-9]+'),
    street VARCHAR(100) NOT NULL,
    number VARCHAR(100) NOT NULL CHECK(number REGEXP '[0-9]+'),
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100) NOT NULL CHECK(email REGEXP '.*@.*'),
    registered_at DATE NOT NULL
);

## Table to store data about the suppliers
CREATE TABLE SUPPLIERS(
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL, 
    state VARCHAR(100) NOT NULL, 
    zip VARCHAR(100) NOT NULL CHECK(zip REGEXP '[0-9]+'),
    street VARCHAR(100) NOT NULL,
    number VARCHAR(100) NOT NULL CHECK(number REGEXP '[0-9]+'),
    country VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL CHECK(email REGEXP '.*@.*'),
    registered_at DATE NOT NULL
);

## Table to register the type of costs, like internet, water etc.
CREATE TABLE COST_TYPES(
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    description VARCHAR(50) NOT NULL
);

## Table to register the output cashflow
CREATE TABLE COSTS(
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    amount FLOAT NOT NULL CHECK(amount >= 0),
    id_cost_type INT NOT NULL,
    CONSTRAINT fk_id_cost_type_to_id FOREIGN KEY (id_cost_type) REFERENCES COST_TYPES(id),
	id_receipt INT,
    CONSTRAINT fk_cost_id_receipt FOREIGN KEY(id_receipt) REFERENCES ORDER_RECEIPTS(id),
    date date NOT NULL
);

## Table to store all the orders made by the clients (revenues)
CREATE TABLE CLIENT_ORDERS(
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    id_client INT NOT NULL,
    CONSTRAINT fk_id_client_client_orders FOREIGN KEY(id_client) REFERENCES CLIENTS(id),
    date date NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente' CHECK(status IN ('pendente', 'pago')),
    total FLOAT NOT NULL CHECK (total >= 0)
);

## Table to store the items in each order made by a client
CREATE TABLE CLIENT_ORDER_ITEMS(
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    id_order INT NOT NULL,
    CONSTRAINT fk_id_order_client_order_items FOREIGN KEY (id_order) REFERENCES CLIENT_ORDERS(id),
    id_product INT NOT NULL,
    CONSTRAINT fk_id_product_client_order_items FOREIGN KEY (id_product) REFERENCES PRODUCTS(id),
    quantity INT NOT NULL,
    unity_price FLOAT NOT NULL
);

## Table to register the individual items bought and the respective prices to place into the storage system
CREATE TABLE PURCHASE_ITEMS_RECEIPT(
	  id_receipt INT NOT NULL,
    id_product INT NOT NULL,
    unity_price FLOAT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_id_receipt_purchase_items_receipt FOREIGN KEY (id_receipt) REFERENCES ORDER_RECEIPTS(id),
    CONSTRAINT fk_id_product_purchase_items_receipt FOREIGN KEY (id_product) REFERENCES PRODUCTS(id),
    PRIMARY KEY(id_receipt, id_product)
);

## Table to register all the items bought 
CREATE TABLE ORDER_RECEIPTS(
	id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    id_supplier INT NOT NULL,
    CONSTRAINT id_supplier_to_order_receipts FOREIGN KEY (id_supplier) REFERENCES SUPPLIERS(id),
    date date NOT NULL,
    total_amount FLOAT NOT NULL
);