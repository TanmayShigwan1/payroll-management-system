-- Payroll Management System Database Script
-- Create Database
CREATE DATABASE IF NOT EXISTS payroll_db;
USE payroll_db;

-- Create Tables
-- 1. Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    user_role ENUM('ADMIN', 'HR', 'EMPLOYEE', 'MANAGER') DEFAULT 'EMPLOYEE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Departments table
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Designations table
CREATE TABLE designations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Employees table
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT UNIQUE,
    department_id BIGINT,
    designation_id BIGINT,
    hire_date DATE,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    marital_status ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    bank_ifsc_code VARCHAR(20),
    pan_number VARCHAR(20),
    aadhar_number VARCHAR(20),
    basic_salary DECIMAL(10, 2),
    employment_status ENUM('ACTIVE', 'INACTIVE', 'TERMINATED', 'RESIGNED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE SET NULL
);

-- 5. Payroll Records table
CREATE TABLE payroll_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    basic_salary DECIMAL(10, 2) NOT NULL,
    hra DECIMAL(10, 2) DEFAULT 0.00,
    da DECIMAL(10, 2) DEFAULT 0.00,
    medical_allowance DECIMAL(10, 2) DEFAULT 0.00,
    transport_allowance DECIMAL(10, 2) DEFAULT 0.00,
    other_allowances DECIMAL(10, 2) DEFAULT 0.00,
    overtime_hours INT DEFAULT 0,
    overtime_amount DECIMAL(10, 2) DEFAULT 0.00,
    gross_salary DECIMAL(10, 2) NOT NULL,
    pf_deduction DECIMAL(10, 2) DEFAULT 0.00,
    esi_deduction DECIMAL(10, 2) DEFAULT 0.00,
    tax_deduction DECIMAL(10, 2) DEFAULT 0.00,
    professional_tax DECIMAL(10, 2) DEFAULT 0.00,
    loan_deduction DECIMAL(10, 2) DEFAULT 0.00,
    other_deductions DECIMAL(10, 2) DEFAULT 0.00,
    total_deductions DECIMAL(10, 2) NOT NULL,
    net_salary DECIMAL(10, 2) NOT NULL,
    working_days INT,
    present_days INT,
    absent_days INT,
    leave_days INT,
    status ENUM('DRAFT', 'CALCULATED', 'APPROVED', 'PAID', 'CANCELLED') DEFAULT 'DRAFT',
    processed_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 6. Attendance Records table
CREATE TABLE attendance_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    total_hours DOUBLE DEFAULT 0.0,
    overtime_hours DOUBLE DEFAULT 0.0,
    status ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE', 'HOLIDAY') NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_date (employee_id, attendance_date)
);

-- Insert Initial Data
-- Insert default admin user
INSERT INTO users (username, email, password, first_name, last_name, user_role) VALUES
('admin', 'admin@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'System', 'Admin', 'ADMIN'),
('hr_manager', 'hr@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'HR', 'Manager', 'HR'),
('john_doe', 'john.doe@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'John', 'Doe', 'EMPLOYEE');

-- Insert departments
INSERT INTO departments (name, description) VALUES
('Human Resources', 'Manages employee relations, recruitment, and HR policies'),
('Information Technology', 'Handles software development, system maintenance, and technical support'),
('Finance', 'Manages company finances, accounting, and financial planning'),
('Marketing', 'Handles marketing campaigns, customer relations, and brand management'),
('Sales', 'Manages sales operations and customer acquisition'),
('Operations', 'Handles day-to-day business operations and process management');

-- Insert designations
INSERT INTO designations (title, description) VALUES
('Software Engineer', 'Develops and maintains software applications'),
('Senior Software Engineer', 'Senior level software development and team leadership'),
('HR Manager', 'Manages human resources department and policies'),
('HR Executive', 'Handles HR operations and employee relations'),
('Accountant', 'Manages financial records and accounting operations'),
('Sales Executive', 'Handles sales operations and customer relations'),
('Marketing Manager', 'Manages marketing campaigns and strategies'),
('Team Lead', 'Leads project teams and coordinates development activities'),
('Manager', 'Manages departmental operations and team coordination'),
('Director', 'Senior management role with strategic responsibilities');

-- Insert sample employees
INSERT INTO employees (employee_id, user_id, department_id, designation_id, hire_date, basic_salary) VALUES
('EMP001', 2, 1, 3, '2023-01-15', 75000.00),
('EMP002', 3, 2, 1, '2023-02-01', 60000.00);

-- Create indexes for better performance
CREATE INDEX idx_employee_id ON employees(employee_id);
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_payroll_employee_period ON payroll_records(employee_id, pay_period_start, pay_period_end);
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, attendance_date);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_designation ON employees(designation_id);

-- Create views for reporting
CREATE VIEW employee_details_view AS
SELECT 
    e.id,
    e.employee_id,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    u.email,
    u.phone_number,
    d.name AS department_name,
    des.title AS designation_title,
    e.hire_date,
    e.basic_salary,
    e.employment_status
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN designations des ON e.designation_id = des.id
WHERE e.employment_status = 'ACTIVE';

CREATE VIEW monthly_payroll_summary AS
SELECT 
    YEAR(pay_period_start) AS year,
    MONTH(pay_period_start) AS month,
    COUNT(*) AS total_employees,
    SUM(gross_salary) AS total_gross_salary,
    SUM(total_deductions) AS total_deductions,
    SUM(net_salary) AS total_net_salary,
    AVG(net_salary) AS average_net_salary
FROM payroll_records
WHERE status IN ('APPROVED', 'PAID')
GROUP BY YEAR(pay_period_start), MONTH(pay_period_start)
ORDER BY year DESC, month DESC;
