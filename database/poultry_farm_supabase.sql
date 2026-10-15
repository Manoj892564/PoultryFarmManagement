-- ========================================================
-- POULTRY FARM MANAGEMENT SYSTEM - SUPABASE POSTGRESQL SCRIPT
-- Compatible with Supabase (PostgreSQL 15+)
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Drop existing tables if they exist (in dependency order)
DROP TABLE IF EXISTS feed_consumption CASCADE;
DROP TABLE IF EXISTS egg_collection CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Table structure for: users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STAFF' CHECK (role IN ('ADMIN', 'MANAGER', 'STAFF')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table structure for: batches
CREATE TABLE batches (
    batch_id SERIAL PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    bird_count INT NOT NULL CHECK (bird_count >= 0),
    arrival_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Sold', 'Culled', 'Quarantine')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table structure for: egg_collection
CREATE TABLE egg_collection (
    collection_id SERIAL PRIMARY KEY,
    collection_date DATE NOT NULL,
    batch_id INT NOT NULL,
    egg_quantity INT NOT NULL CHECK (egg_quantity >= 0),
    broken_eggs INT NOT NULL DEFAULT 0 CHECK (broken_eggs >= 0),
    good_eggs INT NOT NULL CHECK (good_eggs >= 0),
    remarks VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_egg_batch FOREIGN KEY (batch_id) 
        REFERENCES batches (batch_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 5. Table structure for: feed_consumption
CREATE TABLE feed_consumption (
    feed_id SERIAL PRIMARY KEY,
    feed_date DATE NOT NULL,
    batch_id INT NOT NULL,
    feed_type VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL CHECK (quantity_kg >= 0),
    cost_per_kg DECIMAL(10,2) NOT NULL CHECK (cost_per_kg >= 0),
    total_cost DECIMAL(12,2) NOT NULL CHECK (total_cost >= 0),
    remarks VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feed_batch FOREIGN KEY (batch_id) 
        REFERENCES batches (batch_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 6. Indexes for performance
CREATE INDEX idx_egg_date ON egg_collection (collection_date);
CREATE INDEX idx_egg_batch ON egg_collection (batch_id);
CREATE INDEX idx_feed_date ON feed_consumption (feed_date);
CREATE INDEX idx_feed_batch ON feed_consumption (batch_id);

-- 7. Seed Data: Default Users
INSERT INTO users (username, password, full_name, role) VALUES
('admin', 'admin123', 'Administrator Manoj', 'ADMIN'),
('manager', 'manager123', 'Farm Supervisor Rajesh', 'MANAGER'),
('staff', 'staff123', 'Egg Collector Kumar', 'STAFF');

-- 8. Seed Data: Batches (Total: 5,000 birds)
INSERT INTO batches (batch_id, batch_name, breed, bird_count, arrival_date, status) VALUES
(1, 'Batch 1 - White Leghorn A', 'Layer', 1200, '2026-09-01', 'Active'),
(2, 'Batch 2 - Rhode Island Red', 'Layer', 1500, '2026-09-10', 'Active'),
(3, 'Batch 3 - BV300 Hybrid', 'Layer', 1350, '2026-08-20', 'Active'),
(4, 'Batch 4 - Lohmann Brown', 'Layer', 950,  '2026-09-15', 'Active');

-- 9. Seed Data: Egg Collection
INSERT INTO egg_collection (collection_date, batch_id, egg_quantity, broken_eggs, good_eggs, remarks) VALUES
('2026-10-01', 1, 123, 3, 120, 'Morning collection - First shed'),
('2026-10-01', 2, 2345, 25, 2320, 'Peak production shed'),
('2026-10-01', 3, 1800, 18, 1782, 'Good shell quality'),
('2026-10-01', 4, 950, 10, 940, 'Evening count verified'),
('2026-10-02', 1, 1140, 12, 1128, 'Normal collection'),
('2026-10-02', 2, 2380, 20, 2360, 'Good production'),
('2026-10-02', 3, 1790, 15, 1775, 'Standard count'),
('2026-10-02', 4, 960, 8, 952, 'Standard count'),
('2026-10-03', 1, 1120, 10, 1110, 'Normal collection'),
('2026-10-03', 2, 2350, 22, 2328, 'Peak rate steady'),
('2026-10-03', 3, 1810, 16, 1794, 'Good quality'),
('2026-10-03', 4, 940, 9, 931, 'Evening harvest');

-- 10. Seed Data: Feed Consumption
INSERT INTO feed_consumption (feed_date, batch_id, feed_type, quantity_kg, cost_per_kg, total_cost, remarks) VALUES
('2026-10-01', 1, 'Layer Mash Phase-1', 150.00, 35.00, 5250.00, 'Morning feeding'),
('2026-10-01', 2, 'Layer Mash Phase-1', 185.00, 35.00, 6475.00, 'Morning feeding'),
('2026-10-01', 3, 'Grower Pellet', 165.00, 34.00, 5610.00, 'Fortified with calcium'),
('2026-10-01', 4, 'Layer Mash Phase-1', 120.00, 35.00, 4200.00, 'Standard ration');

-- 11. Sync Sequences with imported IDs
SELECT setval(pg_get_serial_sequence('users', 'user_id'), COALESCE(MAX(user_id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('batches', 'batch_id'), COALESCE(MAX(batch_id), 1)) FROM batches;
SELECT setval(pg_get_serial_sequence('egg_collection', 'collection_id'), COALESCE(MAX(collection_id), 1)) FROM egg_collection;
SELECT setval(pg_get_serial_sequence('feed_consumption', 'feed_id'), COALESCE(MAX(feed_id), 1)) FROM feed_consumption;
