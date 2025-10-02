package com.payroll.system.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({"employees", "hibernateLazyInitializer", "handler"})
    private Department department;
    
    @NotNull(message = "Pay period start date is required")
    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;
    
    @NotNull(message = "Pay period end date is required")
    @Column(name = "pay_period_end", nullable = false)
    private LocalDate payPeriodEnd;
    
    @NotNull(message = "Gross pay is required")
    @Column(name = "gross_pay", nullable = false)
    private Double grossPay;
    
    @NotNull(message = "Income tax is required")
    @Column(name = "income_tax", nullable = false)
    private Double incomeTax;
    
    @Column(name = "provident_fund")
    private Double providentFund;
    
    @Column(name = "esi")
    private Double esi;
    
    @Column(name = "professional_tax")
    private Double professionalTax;
    
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

    @Column(name = "regular_hours")
    private Double regularHours;

    @Column(name = "overtime_hours")
    private Double overtimeHours;

    // Constructors
    public Payroll() {}

    public Payroll(Employee employee, LocalDate payPeriodStart, LocalDate payPeriodEnd,
                   Double grossPay, Double incomeTax, Double providentFund, Double netPay) {
        this.employee = employee;
        this.payPeriodStart = payPeriodStart;
        this.payPeriodEnd = payPeriodEnd;
        this.grossPay = grossPay;
        this.incomeTax = incomeTax;
        this.providentFund = providentFund;
        this.netPay = netPay;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public LocalDate getPayPeriodStart() { return payPeriodStart; }
    public void setPayPeriodStart(LocalDate payPeriodStart) { this.payPeriodStart = payPeriodStart; }

    public LocalDate getPayPeriodEnd() { return payPeriodEnd; }
    public void setPayPeriodEnd(LocalDate payPeriodEnd) { this.payPeriodEnd = payPeriodEnd; }

    public Double getGrossPay() { return grossPay; }
    public void setGrossPay(Double grossPay) { this.grossPay = grossPay; }

    public Double getIncomeTax() { return incomeTax; }
    public void setIncomeTax(Double incomeTax) { this.incomeTax = incomeTax; }

    public Double getProvidentFund() { return providentFund; }
    public void setProvidentFund(Double providentFund) { this.providentFund = providentFund; }

    public Double getEsi() { return esi; }
    public void setEsi(Double esi) { this.esi = esi; }

    public Double getProfessionalTax() { return professionalTax; }
    public void setProfessionalTax(Double professionalTax) { this.professionalTax = professionalTax; }

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

    public Double getRegularHours() { return regularHours; }
    public void setRegularHours(Double regularHours) { this.regularHours = regularHours; }

    public Double getOvertimeHours() { return overtimeHours; }
    public void setOvertimeHours(Double overtimeHours) { this.overtimeHours = overtimeHours; }
    
    @PrePersist
    public void prePersist() {
        if (processingDate == null) {
            processingDate = LocalDate.now();
        }
    }
}