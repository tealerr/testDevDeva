-- 4.1 SELECT ข้อมูล STORE ที่มี Region เป็น East
SELECT * FROM store WHERE Region = 'East'

-- 4.2 SELECT ข้อมูล PRODUCT ที่มีขายใน STORE New York
SELECT p.*
FROM product p
INNER JOIN sales_fatch sf ON p.product_key = sf.product_key
INNER JOIN store s ON sf.store_key = s.store_key
WHERE s.city = 'New York';

-- 4.3 SELECT ยอดรวม Profit ของ STORE New York
SELECT SUM(sf.profit) AS total_profit
FROM sale_fact sf
INNER JOIN store s ON sf.store_key = s.store_key
WHERE s.city = 'New York';


-- 4.4 DELETE ข้อมูล SALE_FACT ที่PRODUCT มี Brand เป็น Wolf
DELETE FROM sale_fact
WHERE product_key IN (
    SELECT product_key
    FROM product
    WHERE brand = 'Wolf'
);

-- 4.5 UPDATE Brand ของ PRODUCT ที่มี Description เป็น Toy Story ให้ Brand เป็น W
UPDATE product
SET brand = 'W'
WHERE description = 'Toy Story';
