-- Database schema script for Payroll Management System (MySQL version)
-- Updated for departments and time & attendance integration

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    cost_center VARCHAR(50),
    description VARCHAR(255)
);

-- Employees table with single-table inheritance fields
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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
    annual_salary DECIMAL(12,2),
    bonus_percentage DECIMAL(5,2),
    hourly_rate DECIMAL(10,2),
    hours_worked DECIMAL(8,2),
    overtime_hours DECIMAL(8,2),
    overtime_rate_multiplier DECIMAL(4,2),
    department_id BIGINT,
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
);

CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_employee_tax_id ON employees(tax_id);
CREATE INDEX idx_employee_last_name ON employees(last_name);
CREATE INDEX idx_employee_department ON employees(department_id);

-- Payrolls table enriched with department and hours tracking
CREATE TABLE IF NOT EXISTS payrolls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    department_id BIGINT,
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
    regular_hours DECIMAL(10,2),
    overtime_hours DECIMAL(10,2),
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_payroll_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
);

CREATE INDEX idx_payroll_employee_id ON payrolls(employee_id);
CREATE INDEX idx_payroll_department_id ON payrolls(department_id);
CREATE INDEX idx_payroll_period ON payrolls(pay_period_start, pay_period_end);
CREATE INDEX idx_payroll_processing_date ON payrolls(processing_date);

-- Pay slips table
CREATE TABLE IF NOT EXISTS pay_slips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
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

CREATE INDEX idx_payslip_number ON pay_slips(payslip_number);
CREATE INDEX idx_payslip_issue_date ON pay_slips(issue_date);

-- Time entries table for attendance integration
CREATE TABLE IF NOT EXISTS time_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    department_id BIGINT,
    entry_date DATE NOT NULL,
    clock_in DATETIME,
    clock_out DATETIME,
    regular_hours DECIMAL(10,2),
    overtime_hours DECIMAL(10,2),
    source VARCHAR(30),
    source_reference VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    imported_at DATETIME,
    approved_at DATETIME,
    approved_by VARCHAR(100),
    notes VARCHAR(255),
    CONSTRAINT fk_time_entry_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_time_entry_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
);

CREATE INDEX idx_time_entry_employee_date ON time_entries(employee_id, entry_date);
CREATE INDEX idx_time_entry_status ON time_entries(status);

-- Audit logs remain unchanged
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    user_id VARCHAR(100),
    action_timestamp TIMESTAMP NOT NULL,
    details TEXT
);

CREATE INDEX idx_audit_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(action_timestamp);

DELIMITER //
CREATE TRIGGER after_employee_change
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (action_type, entity_type, entity_id, action_timestamp, details)
    VALUES ('UPDATE', 'EMPLOYEE', NEW.id, NOW(), CONCAT('Employee ID ', NEW.id, ' updated'));
END//

CREATE TRIGGER after_payroll_insert
AFTER INSERT ON payrolls
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (action_type, entity_type, entity_id, action_timestamp, details)
    VALUES ('INSERT', 'PAYROLL', NEW.id, NOW(), CONCAT('Payroll processed for employee ID ', NEW.employee_id));
END//

CREATE TRIGGER after_payslip_insert
AFTER INSERT ON pay_slips
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (action_type, entity_type, entity_id, action_timestamp, details)
    VALUES ('INSERT', 'PAYSLIP', NEW.id, NOW(), CONCAT('PaySlip generated with number ', NEW.payslip_number));
END//
DELIMITER ;

-- Sample master data
INSERT INTO departments (name, cost_center, description) VALUES
('Engineering', 'ENG-100', 'Product engineering and development'),
('Human Resources', 'HR-200', 'Talent management and welfare'),
('Finance', 'FIN-300', 'Accounting and payroll governance');

INSERT INTO employees (employee_type, first_name, last_name, email, phone_number, hire_date, address, city, state, zip_code, tax_id, annual_salary, bonus_percentage, department_id) VALUES
('SALARIED', 'John', 'Doe', 'john.doe@example.com', '555-123-4567', '2020-01-15', '123 Main St', 'New York', 'NY', '10001', 'TX-1001', 75000.00, 5.0, 1),
('SALARIED', 'Jane', 'Smith', 'jane.smith@example.com', '555-234-5678', '2019-06-20', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'TX-1002', 85000.00, 7.5, 1),
('SALARIED', 'Michael', 'Johnson', 'michael.johnson@example.com', '555-345-6789', '2021-03-10', '789 Pine St', 'Chicago', 'IL', '60007', 'TX-1003', 65000.00, 4.0, 3);

INSERT INTO employees (employee_type, first_name, last_name, email, phone_number, hire_date, address, city, state, zip_code, tax_id, hourly_rate, hours_worked, overtime_hours, overtime_rate_multiplier, department_id) VALUES
('HOURLY', 'Robert', 'Williams', 'robert.williams@example.com', '555-456-7890', '2020-09-05', '101 Elm St', 'Houston', 'TX', '77001', 'TX-2001', 25.00, 160.0, 10.0, 1.5, 2),
('HOURLY', 'Sarah', 'Brown', 'sarah.brown@example.com', '555-567-8901', '2021-05-18', '202 Maple Ave', 'Phoenix', 'AZ', '85001', 'TX-2002', 22.50, 155.0, 5.0, 1.5, 2),
('HOURLY', 'David', 'Davis', 'david.davis@example.com', '555-678-9012', '2022-01-12', '303 Cedar Blvd', 'Philadelphia', 'PA', '19019', 'TX-2003', 20.00, 160.0, 0.0, 1.5, 3);

INSERT INTO payrolls (employee_id, department_id, pay_period_start, pay_period_end, gross_pay, federal_tax, state_tax, social_security, medicare, health_insurance, retirement_contribution, other_deductions, net_pay, processing_date, payment_method, regular_hours, overtime_hours) VALUES
(1, 1, '2025-09-01', '2025-09-15', 3125.00, 625.00, 187.50, 193.75, 45.31, 150.00, 187.50, 0.00, 1735.94, '2025-09-16', 'Direct Deposit', 80.0, 5.0),
(2, 1, '2025-09-01', '2025-09-15', 3541.67, 708.33, 212.50, 219.58, 51.35, 175.00, 212.50, 50.00, 1912.41, '2025-09-16', 'Direct Deposit', 80.0, 8.0),
(4, 2, '2025-09-01', '2025-09-15', 4375.00, 875.00, 262.50, 271.25, 63.44, 125.00, 218.75, 0.00, 2559.06, '2025-09-16', 'Direct Deposit', 80.0, 4.0);

INSERT INTO pay_slips (payroll_id, payslip_number, issue_date, payment_date, bank_account_number, bank_routing_number, status, generated_timestamp) VALUES
(1, 'PS-1-20259-1234', '2025-09-16', '2025-09-18', '****1234', '****5678', 'PROCESSED', '2025-09-16 09:30:00'),
(2, 'PS-2-20259-2345', '2025-09-16', '2025-09-18', '****2345', '****6789', 'PROCESSED', '2025-09-16 09:35:00'),
(3, 'PS-4-20259-3456', '2025-09-16', '2025-09-18', '****3456', '****7890', 'PROCESSED', '2025-09-16 09:40:00');

INSERT INTO time_entries (employee_id, department_id, entry_date, clock_in, clock_out, regular_hours, overtime_hours, source, status, imported_at) VALUES
(1, 1, '2025-09-02', '2025-09-02 09:00:00', '2025-09-02 18:00:00', 8.0, 1.0, 'BIOMETRIC', 'APPROVED', '2025-09-02 18:05:00'),
(4, 2, '2025-09-03', '2025-09-03 08:00:00', '2025-09-03 17:30:00', 8.5, 0.5, 'BIOMETRIC', 'APPROVED', '2025-09-03 17:32:00');