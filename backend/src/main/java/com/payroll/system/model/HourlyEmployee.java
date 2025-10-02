package com.payroll.system.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

/**
 * Entity class for hourly employees who are paid based on hours worked.
 * Extends the base Employee class with hourly-specific attributes.
 */
@Entity
@DiscriminatorValue("HourlyEmployee")
public class HourlyEmployee extends Employee {

    @NotNull(message = "Hourly rate is required")
    @Positive(message = "Hourly rate must be positive")
    @Column(name = "hourly_rate")
    private Double hourlyRate;
    
    @PositiveOrZero(message = "Hours worked must be zero or positive")
    @Column(name = "hours_worked")
    private Double hoursWorked;
    
    @Column(name = "overtime_hours")
    private Double overtimeHours;
    
    @Column(name = "overtime_rate_multiplier")
    private Double overtimeRateMultiplier = 1.5;

    // Constructors
    public HourlyEmployee() {
        super();
    }

    public HourlyEmployee(String firstName, String lastName, String email, String phoneNumber,
                         LocalDate hireDate, String address, String city, String state,
                         String zipCode, String taxId, Double hourlyRate, Double hoursWorked) {
        super(firstName, lastName, email, phoneNumber, hireDate, address, city, state, zipCode, taxId);
        this.hourlyRate = hourlyRate;
        this.hoursWorked = hoursWorked;
        this.overtimeRateMultiplier = 1.5;
    }

    // Getters and Setters
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public Double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Double hoursWorked) { this.hoursWorked = hoursWorked; }

    public Double getOvertimeHours() { return overtimeHours; }
    public void setOvertimeHours(Double overtimeHours) { this.overtimeHours = overtimeHours; }

    public Double getOvertimeRateMultiplier() { return overtimeRateMultiplier; }
    public void setOvertimeRateMultiplier(Double overtimeRateMultiplier) { this.overtimeRateMultiplier = overtimeRateMultiplier; }
    
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