-- Database schema script for Payroll Management System
-- This script creates all required tables with appropriate relationships

-- Note: In PostgreSQL, you typically connect directly to a database
-- These commands should be run by a superuser when connected to the postgres database
-- DROP DATABASE IF EXISTS payroll_db;
-- CREATE DATABASE payroll_db;

-- Then reconnect to the payroll_db before running the rest of this script

-- Create the employees table with inheritance support using discriminator column
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_type VARCHAR(20) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    hire_date DATE NOT NULL,
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    tax_id VARCHAR(50) UNIQUE,
    
    -- Fields for salaried employees
    annual_salary DECIMAL(12,2),
    bonus_percentage DECIMAL(5,2),
    
    -- Fields for hourly employees
    hourly_rate DECIMAL(10,2),
    hours_worked DECIMAL(8,2),
    overtime_hours DECIMAL(8,2),
    overtime_rate_multiplier DECIMAL(4,2)
);

-- Create indexes for employees table
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_employee_tax_id ON employees(tax_id);
CREATE INDEX idx_employee_last_name ON employees(last_name);

-- Create the payrolls table
CREATE TABLE payrolls (
    id SERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_pay DECIMAL(12,2) NOT NULL,
    federal_tax DECIMAL(12,2) NOT NULL,
    state_tax DECIMAL(12,2) NOT NULL,
    social_security DECIMAL(12,2),
    medicare DECIMAL(12,2),
    health_insurance DECIMAL(12,2),
    retirement_contribution DECIMAL(12,2),
    other_deductions DECIMAL(12,2),
    net_pay DECIMAL(12,2) NOT NULL,
    processing_date DATE NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
);

-- Create indexes for payrolls table
CREATE INDEX idx_payroll_employee_id ON payrolls(employee_id);
CREATE INDEX idx_payroll_period ON payrolls(pay_period_start, pay_period_end);
CREATE INDEX idx_payroll_processing_date ON payrolls(processing_date);

-- Create the pay_slips table
CREATE TABLE pay_slips (
    id SERIAL PRIMARY KEY,
    payroll_id BIGINT NOT NULL UNIQUE,
    payslip_number VARCHAR(50) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    payment_date DATE,
    bank_account_number VARCHAR(50),
    bank_routing_number VARCHAR(50),
    status VARCHAR(50),
    generated_timestamp TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_payslip_payroll FOREIGN KEY (payroll_id) REFERENCES payrolls (id) ON DELETE CASCADE
);

-- Create indexes for pay_slips table
CREATE INDEX idx_payslip_number ON pay_slips(payslip_number);
CREATE INDEX idx_payslip_issue_date ON pay_slips(issue_date);

-- Create an audit log table to track important system actions
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    user_id VARCHAR(100),
    action_timestamp TIMESTAMP NOT NULL,
    details TEXT
);

-- Create indexes for audit_logs table
CREATE INDEX idx_audit_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(action_timestamp);

-- Create audit functions
CREATE OR REPLACE FUNCTION log_employee_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action_type, entity_type, entity_id, action_timestamp, details)
    VALUES ('UPDATE', 'EMPLOYEE', NEW.id, NOW(), 'Employee ID ' || NEW.id || ' updated');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_payroll_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action_type, entity_type, entity_id, action_timestamp, details)
    VALUES ('INSERT', 'PAYROLL', NEW.id, NOW(), 'Payroll processed for employee ID ' || NEW.employee_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_payslip_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action_type, entity_type, entity_id, action_timestamp, details)
    VALUES ('INSERT', 'PAYSLIP', NEW.id, NOW(), 'PaySlip generated with number ' || NEW.payslip_number);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER after_employee_change
AFTER UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION log_employee_change();

CREATE TRIGGER after_payroll_insert
AFTER INSERT ON payrolls
FOR EACH ROW
EXECUTE FUNCTION log_payroll_insert();

CREATE TRIGGER after_payslip_insert
AFTER INSERT ON pay_slips
FOR EACH ROW
EXECUTE FUNCTION log_payslip_insert();



-- Sample data insertion
-- Sample Salaried Employees
INSERT INTO employees (employee_type, first_name, last_name, email, phone_number, hire_date, address, city, state, zip_code, tax_id, annual_salary, bonus_percentage)
VALUES 
('SALARIED', 'John', 'Doe', 'john.doe@example.com', '555-123-4567', '2020-01-15', '123 Main St', 'New York', 'NY', '10001', 'TX-1001', 75000.00, 5.0),
('SALARIED', 'Jane', 'Smith', 'jane.smith@example.com', '555-234-5678', '2019-06-20', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'TX-1002', 85000.00, 7.5),
('SALARIED', 'Michael', 'Johnson', 'michael.johnson@example.com', '555-345-6789', '2021-03-10', '789 Pine St', 'Chicago', 'IL', '60007', 'TX-1003', 65000.00, 4.0);

-- Sample Hourly Employees
INSERT INTO employees (employee_type, first_name, last_name, email, phone_number, hire_date, address, city, state, zip_code, tax_id, hourly_rate, hours_worked, overtime_hours, overtime_rate_multiplier)
VALUES 
('HOURLY', 'Robert', 'Williams', 'robert.williams@example.com', '555-456-7890', '2020-09-05', '101 Elm St', 'Houston', 'TX', '77001', 'TX-2001', 25.00, 160.0, 10.0, 1.5),
('HOURLY', 'Sarah', 'Brown', 'sarah.brown@example.com', '555-567-8901', '2021-05-18', '202 Maple Ave', 'Phoenix', 'AZ', '85001', 'TX-2002', 22.50, 155.0, 5.0, 1.5),
('HOURLY', 'David', 'Davis', 'david.davis@example.com', '555-678-9012', '2022-01-12', '303 Cedar Blvd', 'Philadelphia', 'PA', '19019', 'TX-2003', 20.00, 160.0, 0.0, 1.5);

-- Sample Payroll Records
INSERT INTO payrolls (employee_id, pay_period_start, pay_period_end, gross_pay, federal_tax, state_tax, social_security, medicare, health_insurance, retirement_contribution, other_deductions, net_pay, processing_date, payment_method)
VALUES 
(1, '2025-09-01', '2025-09-15', 3125.00, 625.00, 187.50, 193.75, 45.31, 150.00, 187.50, 0.00, 1735.94, '2025-09-16', 'Direct Deposit'),
(2, '2025-09-01', '2025-09-15', 3541.67, 708.33, 212.50, 219.58, 51.35, 175.00, 212.50, 50.00, 1912.41, '2025-09-16', 'Direct Deposit'),
(4, '2025-09-01', '2025-09-15', 4375.00, 875.00, 262.50, 271.25, 63.44, 125.00, 218.75, 0.00, 2559.06, '2025-09-16', 'Direct Deposit');

-- Sample PaySlip Records
INSERT INTO pay_slips (payroll_id, payslip_number, issue_date, payment_date, bank_account_number, bank_routing_number, status, generated_timestamp)
VALUES 
(1, 'PS-1-20259-1234', '2025-09-16', '2025-09-18', '****1234', '****5678', 'PROCESSED', '2025-09-16 09:30:00'),
(2, 'PS-2-20259-2345', '2025-09-16', '2025-09-18', '****2345', '****6789', 'PROCESSED', '2025-09-16 09:35:00'),
(3, 'PS-4-20259-3456', '2025-09-16', '2025-09-18', '****3456', '****7890', 'PROCESSED', '2025-09-16 09:40:00');