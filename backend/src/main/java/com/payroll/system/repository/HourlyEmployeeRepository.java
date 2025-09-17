package com.payroll.system.repository;

import com.payroll.system.model.HourlyEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for HourlyEmployee entities.
 * Provides standard CRUD operations and custom query methods specific to hourly employees.
 */
@Repository
public interface HourlyEmployeeRepository extends JpaRepository<HourlyEmployee, Long> {
    
    /**
     * Find hourly employees whose hourly rate is greater than the given amount.
     * 
     * @param rate The hourly rate threshold
     * @return List of hourly employees with hourly rate above the threshold
     */
    List<HourlyEmployee> findByHourlyRateGreaterThan(Double rate);
    
    /**
     * Find hourly employees whose hourly rate is less than the given amount.
     * 
     * @param rate The hourly rate threshold
     * @return List of hourly employees with hourly rate below the threshold
     */
    List<HourlyEmployee> findByHourlyRateLessThan(Double rate);
    
    /**
     * Find hourly employees whose hourly rate is between the given minimum and maximum amounts.
     * 
     * @param minRate The minimum hourly rate
     * @param maxRate The maximum hourly rate
     * @return List of hourly employees with hourly rate within the range
     */
    List<HourlyEmployee> findByHourlyRateBetween(Double minRate, Double maxRate);
    
    /**
     * Find hourly employees whose hours worked exceed the given threshold.
     * 
     * @param hours The hours worked threshold
     * @return List of hourly employees with hours worked above the threshold
     */
    List<HourlyEmployee> findByHoursWorkedGreaterThan(Double hours);
}