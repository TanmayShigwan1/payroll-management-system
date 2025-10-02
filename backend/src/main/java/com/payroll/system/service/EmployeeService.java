package com.payroll.system.service;

import com.payroll.system.model.Employee;
import com.payroll.system.model.HourlyEmployee;
import com.payroll.system.model.SalariedEmployee;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing employees.
 */
public interface EmployeeService {
    
    /**
     * Get all employees regardless of type.
     * 
     * @return List of all employees
     */
    List<Employee> getAllEmployees();
    
    /**
     * Get an employee by ID.
     * 
     * @param id The employee ID
     * @return Optional containing the employee if found
     */
    Optional<Employee> getEmployeeById(Long id);
    
    /**
     * Create a new hourly employee.
     * 
     * @param employee The hourly employee to create
     * @return The created employee with assigned ID
     */
    HourlyEmployee createHourlyEmployee(HourlyEmployee employee);
    
    /**
     * Create a new salaried employee.
     * 
     * @param employee The salaried employee to create
     * @return The created employee with assigned ID
     */
    SalariedEmployee createSalariedEmployee(SalariedEmployee employee);
    
    /**
     * Update an existing employee.
     * 
     * @param id The employee ID
     * @param employeeDetails The updated employee details
     * @return The updated employee
     */
    Employee updateEmployee(Long id, Employee employeeDetails);
    
    /**
     * Delete an employee by ID.
     * 
     * @param id The employee ID to delete
     * @return true if employee was deleted, false otherwise
     */
    boolean deleteEmployee(Long id);
    
    /**
     * Search for employees by last name.
     * 
     * @param lastName The last name to search for
     * @return List of matching employees
     */
    List<Employee> findByLastName(String lastName);
    
    /**
     * Find an employee by email address.
     * 
     * @param email The email to search for
     * @return Optional containing the matching employee if found
     */
    Optional<Employee> findByEmail(String email);
    
    /**
     * Update an employee's status.
     * 
     * @param id The employee ID
     * @param newStatus The new status (Active, On Leave, Terminated)
     * @return The updated employee
     */
    Employee updateEmployeeStatus(Long id, String newStatus);

    /**
     * Get employees by department.
     */
    List<Employee> getEmployeesByDepartment(Long departmentId);

    /**
     * Assign or reassign an employee to a department.
     */
    Employee assignDepartment(Long employeeId, Long departmentId);
}