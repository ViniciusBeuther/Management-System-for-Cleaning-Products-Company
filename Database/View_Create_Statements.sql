use mei_system_db;

-- ====== STORAGE MODULE ======

-- Calculate Average Unit Price 
CREATE VIEW v_average_entry_price AS
	SELECT p.product_id, p.product_name, SUM(oi.quantity) AS 'quantity_bought', AVG(oi.unit_price) AS 'average_entry_price', MAX(oi.unit_price) AS 'max_price', MIN(oi.unit_price) AS 'min_price' FROM
	Entry_Order eo
	JOIN Orders o ON eo.entry_order_id = o.order_id
	JOIN Order_Item oi ON o.order_id = oi.order_id
	JOIN Product p ON p.product_id = oi.product_id
	GROUP BY p.product_id;


-- Calculate current stock / quantity bought / Quantity Sold
CREATE VIEW v_current_stock 
AS
	SELECT 
		p.product_id, p.product_name, p.product_price as 'sell_price',
		COALESCE(entry.total_bought, 0) AS 'bought_quantity',
		COALESCE(exits.total_sold, 0) AS 'sold_quantity',
		COALESCE(entry.total_bought, 0) - COALESCE(exits.total_sold, 0) AS 'current_stock'
	FROM Product p
	LEFT JOIN (
		-- Total bought (Entry)
		SELECT oi.product_id, SUM(oi.quantity) AS total_bought
		FROM Order_Item oi
		JOIN Entry_Order eo ON oi.order_id = eo.entry_order_id
		GROUP BY oi.product_id
	) entry ON p.product_id = entry.product_id
	LEFT JOIN (
		-- Total sold (Exits)
		SELECT oi.product_id, SUM(oi.quantity) AS total_sold
		FROM Order_Item oi
		JOIN Exit_Order exo ON oi.order_id = exo.exit_order_id
		GROUP BY oi.product_id
	) exits ON p.product_id = exits.product_id
	ORDER BY current_stock DESC;


-- ====== ORDERS MODULE ======

-- Get all sell orders
CREATE VIEW v_sell_orders AS
SELECT 
    o.order_id, 
    s.status, 
    CONCAT(pe.first_name, ' ', pe.last_name) AS customer_name,
    SUM(oi.unit_price * oi.quantity) AS total,
    o.order_date
FROM Exit_Order exo
JOIN Orders o ON o.order_id = exo.exit_order_id
JOIN status s ON s.status_id = o.order_status_id
JOIN Order_Item oi ON oi.order_id = o.order_id
JOIN Customer c ON exo.customer_id = c.customer_id
JOIN Person pe ON c.customer_id = pe.person_id
GROUP BY o.order_id, s.status, pe.first_name, pe.last_name, o.order_date;

-- Get all buy orders (entry)
CREATE VIEW v_buy_orders AS
SELECT 
    o.order_id, 
    s.status, 
    sp.company_name,
    SUM(oi.unit_price * oi.quantity) AS total,
    o.order_date
FROM Entry_Order eo
JOIN Orders o ON o.order_id = eo.entry_order_id
JOIN status s ON s.status_id = o.order_status_id
JOIN Order_Item oi ON oi.order_id = o.order_id
JOIN Supplier sp ON eo.supplier_id = sp.supplier_id
GROUP BY o.order_id, s.status, sp.company_name, o.order_date;

-- Get detailed sell orders and items
CREATE VIEW v_sell_order_items AS
SELECT 
	o.order_id, 
    s.status, 
    CONCAT(pe.first_name, ' ', pe.last_name) AS 'customer_name',
    p.product_name,
    oi.quantity,
    oi.unit_price,
	(oi.unit_price * oi.quantity) AS 'total',
    o.order_date
FROM Exit_Order exo
JOIN Orders o ON o.order_id = exo.exit_order_id
JOIN status s ON s.status_id = o.order_status_id
JOIN Order_Item oi ON oi.order_id = o.order_id
JOIN Product p ON p.product_id = oi.product_id
JOIN Customer c ON exo.customer_id = c.customer_id
JOIN Person pe ON c.customer_id = pe.person_id;

-- Get detailed buy orders and items
CREATE VIEW v_buy_order_items AS
SELECT 
	o.order_id, 
    s.status, 
	sp.company_name,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    (oi.unit_price * oi.quantity) AS 'total',
    o.order_date
FROM Entry_Order eo
JOIN Orders o ON o.order_id = eo.entry_order_id
JOIN status s ON s.status_id = o.order_status_id
JOIN Order_Item oi ON oi.order_id = o.order_id
JOIN Product p ON p.product_id = oi.product_id
JOIN Supplier sp ON eo.supplier_id = sp.supplier_id
ORDER BY o.order_date;

-- Get pending orders (pending payment)
CREATE VIEW v_pending_entry_orders AS
SELECT 
    eo.entry_order_id,
    s.status,
    sp.company_name,
    o.order_date,
    SUM(oi.unit_price * oi.quantity) AS total
FROM Entry_Order eo
JOIN Supplier sp ON eo.supplier_id = sp.supplier_id
JOIN Orders o ON eo.entry_order_id = o.order_id
JOIN status s ON o.order_status_id = s.status_id
JOIN Order_Item oi ON o.order_id = oi.order_id
JOIN Product p ON p.product_id = oi.product_id
WHERE s.status = 'Pendente'
GROUP BY eo.entry_order_id, s.status, sp.company_name, o.order_date;

-- ====== COSTS MODULE ======

-- Get all bills paid and unpaid
CREATE VIEW v_all_bills AS
SELECT bt.bill_type,
	b.bill_price,
	s.status,
	bs.bill_status_date AS date
FROM Bill b
JOIN Bill_Type bt ON bt.bill_type_id = b.bill_type_id
JOIN Bill_Status bs ON bs.bill_id = b.bill_id
JOIN Status s ON s.status_id = bs.status_id;

-- Get all unpaid orders and the customer name (exit)
CREATE VIEW v_unpaid_exit_orders AS
SELECT 
	o.order_id,
    o.order_date, 
    CONCAT(p.first_name, ' ', p.last_name) AS 'full_name',
    SUM(oi.quantity * pr.product_price) AS total,
    s.status
FROM 
	Orders o 
JOIN Exit_Order eo ON eo.exit_order_id = o.order_id
JOIN Customer c ON c.customer_id = eo.customer_id
JOIN Person p ON c.customer_id = p.person_id
JOIN Order_Item oi ON oi.order_id = o.order_id
JOIN Status s ON o.order_status_id = s.status_id
JOIN Product pr ON oi.product_id = pr.product_id
WHERE s.status = 'Pendente'
GROUP BY o.order_id, o.order_date, p.first_name, p.last_name, s.status;


-- View items from pending orders
CREATE VIEW v_unpaid_exit_orders_items AS
SELECT 
	o.order_id,
    p.product_name,
    oi.quantity,
    p.product_price AS 'sell_price',
    p.product_price * oi.quantity AS 'product_total',
    s.status
FROM Orders o
JOIN Status s ON s.status_id = o.order_status_id
JOIN Exit_Order eo ON eo.exit_order_id = o.order_id
JOIN Order_Item oi ON oi.order_id = o.order_id
JOIN Product p ON p.product_id = oi.product_id 
WHERE s.status = 'Pendente';