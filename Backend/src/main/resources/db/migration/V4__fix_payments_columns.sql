-- Drop and recreate the payments table with correct column types
DROP TABLE IF EXISTS payments;

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(19,2) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    is_active BIT NOT NULL,
    order_id BIGINT NOT NULL,
    payment_date DATETIME(6),
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_url TEXT,
    transaction_id TEXT,
    updated_at DATETIME(6) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
); 