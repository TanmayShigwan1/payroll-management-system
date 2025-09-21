package com.payroll.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

/**
 * Entity class to store payroll calculation details for each employee and pay period.
 */
@Entity
@Table(name = "payrolls")
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @NotNull(message = "Pay period start date is required")
    @PastOrPresent(message = "Pay period start date must be in the past or present")
    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;
    
    @NotNull(message = "Pay period end date is required")
    @PastOrPresent(message = "Pay period end date must be in the past or present")
    @Column(name = "pay_period_end", nullable = false)
    private LocalDate payPeriodEnd;
    
    @NotNull(message = "Gross pay is required")
    @Column(name = "gross_pay", nullable = false)
    private Double grossPay;
    
    @NotNull(message = "Federal tax is required")
    @Column(name = "federal_tax", nullable = false)
    private Double federalTax;
    
    @NotNull(message = "State tax is required")
    @Column(name = "state_tax", nullable = false)
    private Double stateTax;
    
    @Column(name = "social_security")
    private Double socialSecurity;
    
    @Column(name = "medicare")
    private Double medicare;
    
    @Column(name = "health_insurance")
    private Double healthInsurance;
    
    @Column(name = "retirement_contribution")
    private Double retirementContribution;
    
    @Column(name = "other_deductions")
    private Double otherDeductions;
    
    @NotNull(message = "Net pay is required")
    @Column(name = "net_pay", nullable = false)
    private Double netPay;
    
    @Column(name = "processing_date", nullable = false)
    private LocalDate processingDate;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "notes")
    private String notes;

    // Constructors
    public Payroll() {}

    public Payroll(Employee employee, LocalDate payPeriodStart, LocalDate payPeriodEnd,
                   Double grossPay, Double federalTax, Double stateTax, Double netPay) {
        this.employee = employee;
        this.payPeriodStart = payPeriodStart;
        this.payPeriodEnd = payPeriodEnd;
        this.grossPay = grossPay;
        this.federalTax = federalTax;
        this.stateTax = stateTax;
        this.netPay = netPay;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getPayPeriodStart() { return payPeriodStart; }
    public void setPayPeriodStart(LocalDate payPeriodStart) { this.payPeriodStart = payPeriodStart; }

    public LocalDate getPayPeriodEnd() { return payPeriodEnd; }
    public void setPayPeriodEnd(LocalDate payPeriodEnd) { this.payPeriodEnd = payPeriodEnd; }

    public Double getGrossPay() { return grossPay; }
    public void setGrossPay(Double grossPay) { this.grossPay = grossPay; }

    public Double getFederalTax() { return federalTax; }
    public void setFederalTax(Double federalTax) { this.federalTax = federalTax; }

    public Double getStateTax() { return stateTax; }
    public void setStateTax(Double stateTax) { this.stateTax = stateTax; }

    public Double getSocialSecurity() { return socialSecurity; }
    public void setSocialSecurity(Double socialSecurity) { this.socialSecurity = socialSecurity; }

    public Double getMedicare() { return medicare; }
    public void setMedicare(Double medicare) { this.medicare = medicare; }

    public Double getHealthInsurance() { return healthInsurance; }
    public void setHealthInsurance(Double healthInsurance) { this.healthInsurance = healthInsurance; }

    public Double getRetirementContribution() { return retirementContribution; }
    public void setRetirementContribution(Double retirementContribution) { this.retirementContribution = retirementContribution; }

    public Double getOtherDeductions() { return otherDeductions; }
    public void setOtherDeductions(Double otherDeductions) { this.otherDeductions = otherDeductions; }

    public Double getNetPay() { return netPay; }
    public void setNetPay(Double netPay) { this.netPay = netPay; }

    public LocalDate getProcessingDate() { return processingDate; }
    public void setProcessingDate(LocalDate processingDate) { this.processingDate = processingDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    @PrePersist
    public void prePersist() {
        if (processingDate == null) {
            processingDate = LocalDate.now();
        }
    }
}