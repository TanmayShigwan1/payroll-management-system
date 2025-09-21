package com.payroll.system.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

/**
 * Entity class for salaried employees who receive a fixed annual salary.
 * Extends the base Employee class with salaried-specific attributes.
 */
@Entity
@DiscriminatorValue("SalariedEmployee")
public class SalariedEmployee extends Employee {

    @NotNull(message = "Annual salary is required")
    @Positive(message = "Annual salary must be positive")
    @Column(name = "annual_salary")
    private Double annualSalary;
    
    @Column(name = "bonus_percentage")
    private Double bonusPercentage;

    // Constructors
    public SalariedEmployee() {
        super();
    }

    public SalariedEmployee(String firstName, String lastName, String email, String phoneNumber,
                           LocalDate hireDate, String address, String city, String state,
                           String zipCode, String taxId, Double annualSalary) {
        super(firstName, lastName, email, phoneNumber, hireDate, address, city, state, zipCode, taxId);
        this.annualSalary = annualSalary;
    }

    // Getters and Setters
    public Double getAnnualSalary() { return annualSalary; }
    public void setAnnualSalary(Double annualSalary) { this.annualSalary = annualSalary; }

    public Double getBonusPercentage() { return bonusPercentage; }
    public void setBonusPercentage(Double bonusPercentage) { this.bonusPercentage = bonusPercentage; }
    
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