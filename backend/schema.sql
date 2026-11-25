-- Criar e selecionar o banco de dados
CREATE DATABASE IF NOT EXISTS petstock 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE petstock;

-- Tabela de Perfis (Usuários / Funcionários / Admins)
CREATE TABLE IF NOT EXISTS profiles (
    id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(180) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
    active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Marcas
CREATE TABLE IF NOT EXISTS brands (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) PRIMARY KEY,
    internal_code VARCHAR(100) NOT NULL UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand_id CHAR(36),
    category_id CHAR(36),
    weight VARCHAR(80) DEFAULT '',
    unit VARCHAR(30) DEFAULT 'UN',
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    minimum_stock INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela de Estoque Atual
CREATE TABLE IF NOT EXISTS inventory (
    product_id CHAR(36) PRIMARY KEY,
    physical_quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS customers (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(30) UNIQUE,
    phone VARCHAR(40),
    city VARCHAR(180),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    order_number BIGINT NOT NULL AUTO_INCREMENT UNIQUE,
    customer_id CHAR(36) NOT NULL,
    status VARCHAR(40) DEFAULT 'novo',
    notes TEXT,
    total DECIMAL(12,2) DEFAULT 0,
    created_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabela de Movimentações de Estoque (Kardex / Histórico)
CREATE TABLE IF NOT EXISTS inventory_movements (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    movement_type VARCHAR(40) NOT NULL,
    quantity_delta INT NOT NULL,
    balance_after INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    note TEXT,
    employee_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movements_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_movements_employee FOREIGN KEY (employee_id) REFERENCES profiles(id)
);