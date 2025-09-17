package com.payroll.system.repository;

import com.payroll.system.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Employee entities.
 * Provides standard CRUD operations and custom query methods.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    /**
     * Find employees by their last name.
     * 
     * @param lastName The last name to search for
     * @return List of employees with matching last name
     */
    List<Employee> findByLastName(String lastName);
    
    /**
     * Find an employee by email address.
     * 
     * @param email The email address to search for
     * @return The matching employee or null if not found
     */
    Employee findByEmail(String email);
    
    /**
     * Find employees by last name containing the given string (case insensitive).
     * 
     * @param lastName The partial last name to search for
     * @return List of employees with last names containing the search string
     */
    List<Employee> findByLastNameContainingIgnoreCase(String lastName);
    
    /**
     * Find employees by their tax ID.
     * 
     * @param taxId The tax ID to search for
     * @return The matching employee or null if not found
     */
    Employee findByTaxId(String taxId);
}