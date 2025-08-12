-- Insert default users
INSERT INTO users (username, email, password, first_name, last_name, phone_number, user_role, is_active) VALUES
('admin', 'admin@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'System', 'Admin', '9999999999', 'ADMIN', true),
('hr_manager', 'hr@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'HR', 'Manager', '9999999998', 'HR', true),
('john_doe', 'john.doe@payroll.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'John', 'Doe', '9999999997', 'EMPLOYEE', true);

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
