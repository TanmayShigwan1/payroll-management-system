-- =================================================================
-- PAYROLL MANAGEMENT SYSTEM - SQL QUERIES FOR MYSQL WORKBENCH
-- =================================================================
-- Use these queries in MySQL Workbench to explore your payroll data
-- and understand the inheritance concepts implemented

-- First, ensure you're using the correct database
USE payroll_db;

-- =================================================================
-- 1. VIEW ALL TABLES IN THE DATABASE
-- =================================================================
SHOW TABLES;

-- =================================================================
-- 2. EXAMINE THE EMPLOYEES TABLE STRUCTURE
-- =================================================================
-- This shows how inheritance is implemented using SINGLE_TABLE strategy
DESCRIBE employees;

-- =================================================================
-- 3. VIEW ALL EMPLOYEES (BOTH SALARIED AND HOURLY)
-- =================================================================
-- Notice the 'employee_type' column that shows inheritance
SELECT 
    id,
    employee_type,
    first_name,
    last_name,
    email,
    phone_number,
    hire_date,
    city,
    state
FROM employees
ORDER BY employee_type, last_name;

-- =================================================================
-- 4. VIEW ONLY SALARIED EMPLOYEES
-- =================================================================
-- Shows employees with salary-specific fields
SELECT 
    id,
    employee_type,
    first_name,
    last_name,
    email,
    annual_salary,
    bonus_percentage,
    hire_date
FROM employees 
WHERE employee_type = 'SalariedEmployee'
ORDER BY annual_salary DESC;

-- =================================================================
-- 5. VIEW ONLY HOURLY EMPLOYEES  
-- =================================================================
-- Shows employees with hourly-specific fields
SELECT 
    id,
    employee_type,
    first_name,
    last_name,
    email,
    hourly_rate,
    hours_worked,
    overtime_hours,
    overtime_rate_multiplier,
    hire_date
FROM employees 
WHERE employee_type = 'HourlyEmployee'
ORDER BY hourly_rate DESC;

-- =================================================================
-- 6. CALCULATE GROSS PAY FOR ALL EMPLOYEES
-- =================================================================
-- This demonstrates the polymorphic behavior of calculateGrossPay()
SELECT 
    id,
    employee_type,
    CONCAT(first_name, ' ', last_name) AS full_name,
    CASE 
        WHEN employee_type = 'SalariedEmployee' THEN 
            ROUND(annual_salary / 12, 2)  -- Monthly salary
        WHEN employee_type = 'HourlyEmployee' THEN 
            ROUND(
                (hourly_rate * hours_worked) + 
                (hourly_rate * overtime_rate_multiplier * overtime_hours), 
                2
            )  -- Regular + overtime pay
        ELSE 0
    END AS gross_pay,
    CASE 
        WHEN employee_type = 'SalariedEmployee' THEN 'Monthly Salary'
        WHEN employee_type = 'HourlyEmployee' THEN 'Hourly + Overtime'
        ELSE 'Unknown'
    END AS pay_type
FROM employees
ORDER BY gross_pay DESC;

-- =================================================================
-- 7. EMPLOYEE STATISTICS BY TYPE
-- =================================================================
-- Shows the distribution of employee types
SELECT 
    employee_type,
    COUNT(*) as employee_count,
    CASE 
        WHEN employee_type = 'SalariedEmployee' THEN 
            CONCAT('Avg Salary: $', FORMAT(AVG(annual_salary), 2))
        WHEN employee_type = 'HourlyEmployee' THEN 
            CONCAT('Avg Rate: $', FORMAT(AVG(hourly_rate), 2))
        ELSE 'N/A'
    END as average_compensation
FROM employees 
GROUP BY employee_type;

-- =================================================================
-- 8. VIEW PAYROLLS TABLE (IF DATA EXISTS)
-- =================================================================
SELECT * FROM payrolls LIMIT 10;

-- =================================================================
-- 9. VIEW PAY SLIPS TABLE (IF DATA EXISTS)
-- =================================================================
SELECT * FROM pay_slips LIMIT 10;

-- =================================================================
-- 10. VIEW AUDIT LOGS TABLE (IF DATA EXISTS)
-- =================================================================
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;

-- =================================================================
-- 11. SEARCH EMPLOYEES BY VARIOUS CRITERIA
-- =================================================================

-- Find employees hired in 2025
SELECT 
    CONCAT(first_name, ' ', last_name) AS full_name,
    employee_type,
    hire_date,
    email
FROM employees 
WHERE YEAR(hire_date) = 2025
ORDER BY hire_date DESC;

-- Find employees by city
SELECT 
    CONCAT(first_name, ' ', last_name) AS full_name,
    employee_type,
    city,
    state,
    email
FROM employees 
WHERE city IS NOT NULL
ORDER BY city, last_name;

-- Find high earners (salary > 70000 OR hourly > 20)
SELECT 
    CONCAT(first_name, ' ', last_name) AS full_name,
    employee_type,
    CASE 
        WHEN employee_type = 'SalariedEmployee' THEN CONCAT('$', FORMAT(annual_salary, 0), '/year')
        WHEN employee_type = 'HourlyEmployee' THEN CONCAT('$', FORMAT(hourly_rate, 2), '/hour')
    END as compensation
FROM employees 
WHERE (employee_type = 'SalariedEmployee' AND annual_salary > 70000)
   OR (employee_type = 'HourlyEmployee' AND hourly_rate > 20)
ORDER BY 
    CASE 
        WHEN employee_type = 'SalariedEmployee' THEN annual_salary
        WHEN employee_type = 'HourlyEmployee' THEN hourly_rate * 2080 -- Estimate annual
    END DESC;

-- =================================================================
-- 12. DATA VALIDATION QUERIES
-- =================================================================

-- Check for duplicate emails
SELECT email, COUNT(*) as count
FROM employees 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Check for duplicate tax IDs
SELECT tax_id, COUNT(*) as count
FROM employees 
WHERE tax_id IS NOT NULL
GROUP BY tax_id 
HAVING COUNT(*) > 1;

-- Validate employee type consistency
SELECT 
    employee_type,
    COUNT(CASE WHEN annual_salary IS NOT NULL THEN 1 END) as has_salary,
    COUNT(CASE WHEN hourly_rate IS NOT NULL THEN 1 END) as has_hourly_rate
FROM employees 
GROUP BY employee_type;

-- =================================================================
-- 13. ADD NEW EMPLOYEES DIRECTLY TO DATABASE
-- =================================================================

-- Add a new SALARIED employee
INSERT INTO employees (
    employee_type, 
    first_name, 
    last_name, 
    email, 
    phone_number, 
    hire_date, 
    address, 
    city, 
    state, 
    zip_code, 
    tax_id, 
    annual_salary, 
    bonus_percentage
) VALUES (
    'SalariedEmployee',
    'Emma',
    'Wilson',
    'emma.wilson@example.com',
    '555-888-9999',
    '2025-09-22',
    '789 Manager St',
    'Seattle',
    'WA',
    '98101',
    'TX-9001',
    95000.00,
    10.0
);

-- Add a new HOURLY employee
INSERT INTO employees (
    employee_type, 
    first_name, 
    last_name, 
    email, 
    phone_number, 
    hire_date, 
    address, 
    city, 
    state, 
    zip_code, 
    tax_id, 
    hourly_rate, 
    hours_worked, 
    overtime_hours, 
    overtime_rate_multiplier
) VALUES (
    'HourlyEmployee',
    'Marcus',
    'Rodriguez',
    'marcus.rodriguez@example.com',
    '555-777-8888',
    '2025-09-22',
    '456 Worker Ave',
    'Denver',
    'CO',
    '80201',
    'TX-9002',
    28.50,
    40.0,
    8.0,
    1.5
);

-- Add another SALARIED employee with different bonus
INSERT INTO employees (
    employee_type, 
    first_name, 
    last_name, 
    email, 
    phone_number, 
    hire_date, 
    address, 
    city, 
    state, 
    zip_code, 
    tax_id, 
    annual_salary, 
    bonus_percentage
) VALUES (
    'SalariedEmployee',
    'Sophia',
    'Chen',
    'sophia.chen@example.com',
    '555-666-7777',
    '2025-09-21',
    '321 Executive Blvd',
    'San Francisco',
    'CA',
    '94102',
    'TX-9003',
    120000.00,
    15.0
);

-- =================================================================
-- 14. VERIFY NEW EMPLOYEES WERE ADDED
-- =================================================================

-- Check the latest employees added (by highest ID)
SELECT 
    id,
    employee_type,
    CONCAT(first_name, ' ', last_name) AS full_name,
    email,
    hire_date,
    CASE 
        WHEN employee_type = 'SalariedEmployee' THEN 
            CONCAT('$', FORMAT(annual_salary, 0), '/year (', bonus_percentage, '% bonus)')
        WHEN employee_type = 'HourlyEmployee' THEN 
            CONCAT('$', FORMAT(hourly_rate, 2), '/hour (', hours_worked, 'h regular + ', overtime_hours, 'h OT)')
    END as compensation_details
FROM employees 
ORDER BY id DESC 
LIMIT 5;

-- Count total employees by type after adding new ones
SELECT 
    employee_type,
    COUNT(*) as total_count
FROM employees 
GROUP BY employee_type;

-- =================================================================
-- 15. DEMO: REAL-TIME VERIFICATION
-- =================================================================
-- After running the INSERT statements above:
-- 1. Go to your website at http://localhost:3000
-- 2. Navigate to the employee list
-- 3. You should see the new employees appear automatically!
-- 4. No need to restart anything - the data is fetched live from the database

-- =================================================================
-- END OF QUERIES
-- =================================================================

-- TIP: You can run these queries one by one in MySQL Workbench
-- to explore different aspects of your payroll management system!