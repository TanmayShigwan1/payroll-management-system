package com.payroll.system.repository;

import com.payroll.system.model.SalariedEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for SalariedEmployee entities.
 * Provides standard CRUD operations and custom query methods specific to salaried employees.
 */
@Repository
public interface SalariedEmployeeRepository extends JpaRepository<SalariedEmployee, Long> {
    
    /**
     * Find salaried employees whose annual salary is greater than the given amount.
     * 
     * @param salary The salary threshold
     * @return List of salaried employees with annual salary above the threshold
     */
    List<SalariedEmployee> findByAnnualSalaryGreaterThan(Double salary);
    
    /**
     * Find salaried employees whose annual salary is less than the given amount.
     * 
     * @param salary The salary threshold
     * @return List of salaried employees with annual salary below the threshold
     */
    List<SalariedEmployee> findByAnnualSalaryLessThan(Double salary);
    
    /**
     * Find salaried employees whose annual salary is between the given minimum and maximum amounts.
     * 
     * @param minSalary The minimum salary
     * @param maxSalary The maximum salary
     * @return List of salaried employees with annual salary within the range
     */
    List<SalariedEmployee> findByAnnualSalaryBetween(Double minSalary, Double maxSalary);
}