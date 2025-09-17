package com.payroll.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Entity class for salaried employees who receive a fixed annual salary.
 * Extends the base Employee class with salaried-specific attributes.
 */
@Entity
@DiscriminatorValue("SALARIED")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SalariedEmployee extends Employee {

    @NotNull(message = "Annual salary is required")
    @Positive(message = "Annual salary must be positive")
    @Column(name = "annual_salary")
    private Double annualSalary;
    
    @Column(name = "bonus_percentage")
    private Double bonusPercentage;
    
    /**
     * Calculates the gross pay for a salaried employee based on their annual salary.
     * The calculation divides the annual salary by 12 to get the monthly amount.
     * 
     * @return Monthly gross pay amount
     */
    @Override
    public double calculateGrossPay() {
        double monthlyPay = annualSalary / 12;
        
        // Add bonus if applicable
        if (bonusPercentage != null && bonusPercentage > 0) {
            monthlyPay += (annualSalary * bonusPercentage / 100) / 12;
        }
        
        return monthlyPay;
    }
}