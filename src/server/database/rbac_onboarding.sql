-- =========================================================================
-- SQL Migration Script: RBAC System & Customer Onboarding Workflow
-- Project: Infinity Bank / Nova Crest Bank
-- =========================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Permissions Table
CREATE TABLE IF NOT EXISTS Permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    resource_module VARCHAR(50) NOT NULL
);

-- 4. User_Roles Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS User_Roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

-- 5. Role_Permissions Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS Role_Permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES Permissions(permission_id) ON DELETE CASCADE
);

-- 6. Account_Requests Table
CREATE TABLE IF NOT EXISTS Account_Requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    status ENUM('PENDING', 'APPROVED_FOR_PAYMENT', 'COMPLETED') DEFAULT 'PENDING',
    assigned_employee_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_employee_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- 7. Opening_Payments Table
CREATE TABLE IF NOT EXISTS Opening_Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL UNIQUE,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 500.00,
    qr_reference_code VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES Account_Requests(request_id) ON DELETE CASCADE
);

-- 8. Accounts Table
CREATE TABLE IF NOT EXISTS Accounts (
    account_number VARCHAR(20) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- =========================================================================
-- Initial Seed Data: Roles, Permissions, and Default Assignments
-- =========================================================================

-- Seed Roles
INSERT IGNORE INTO Roles (role_id, role_name) VALUES 
(1, 'Admin'),
(2, 'Bank_Employee'),
(3, 'Retail_Customer');

-- Seed Permissions
INSERT IGNORE INTO Permissions (permission_id, permission_name, resource_module) VALUES 
(1, 'view_pending_requests', 'onboarding'),
(2, 'approve_account_request', 'onboarding'),
(3, 'manage_users', 'admin');

-- Seed Role_Permissions
INSERT IGNORE INTO Role_Permissions (role_id, permission_id) VALUES 
(1, 1), -- Admin -> view_pending_requests
(1, 2), -- Admin -> approve_account_request
(1, 3), -- Admin -> manage_users
(2, 1), -- Bank_Employee -> view_pending_requests
(2, 2); -- Bank_Employee -> approve_account_request
