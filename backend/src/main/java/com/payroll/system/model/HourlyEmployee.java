package com.payroll.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

/**
 * Entity class for hourly employees who are paid based on hours worked.
 * Extends the base Employee class with hourly-specific attributes.
 */
@Entity
@DiscriminatorValue("HOURLY")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class HourlyEmployee extends Employee {

    @NotNull(message = "Hourly rate is required")
    @Positive(message = "Hourly rate must be positive")
    @Column(name = "hourly_rate")
    private Double hourlyRate;
    
    @NotNull(message = "Hours worked is required")
    @Positive(message = "Hours worked must be positive")
    @Column(name = "hours_worked")
    private Double hoursWorked;
    
    @Column(name = "overtime_hours")
    private Double overtimeHours;
    
    @Column(name = "overtime_rate_multiplier")
    private Double overtimeRateMultiplier = 1.5;
    
    /**
     * Calculates the gross pay for an hourly employee based on:
     * - Regular hours at the standard hourly rate
     * - Overtime hours at the overtime rate (typically 1.5x the standard rate)
     * 
     * @return Total gross pay amount
     */
    @Override
    public double calculateGrossPay() {
        double regularPay = hourlyRate * hoursWorked;
        
        // Add overtime pay if applicable
        double overtimePay = 0.0;
        if (overtimeHours != null && overtimeHours > 0) {
            overtimePay = hourlyRate * overtimeHours * overtimeRateMultiplier;
        }
        
        return regularPay + overtimePay;
    }
}