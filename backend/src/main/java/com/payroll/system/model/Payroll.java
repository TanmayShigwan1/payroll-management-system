package com.payroll.system.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.time.LocalDate;

/**
 * Entity class to store payroll calculation details for each employee and pay period.
 */
@Entity
@Table(name = "payrolls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    
    @PrePersist
    public void prePersist() {
        if (processingDate == null) {
            processingDate = LocalDate.now();
        }
    }
}