package com.payroll.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll_records")
public class PayrollRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "pay_period_start")
    private LocalDate payPeriodStart;

    @Column(name = "pay_period_end")
    private LocalDate payPeriodEnd;

    @Column(name = "basic_salary", precision = 10, scale = 2)
    private BigDecimal basicSalary;

    @Column(name = "hra", precision = 10, scale = 2)
    private BigDecimal hra = BigDecimal.ZERO;

    @Column(name = "da", precision = 10, scale = 2)
    private BigDecimal da = BigDecimal.ZERO;

    @Column(name = "medical_allowance", precision = 10, scale = 2)
    private BigDecimal medicalAllowance = BigDecimal.ZERO;

    @Column(name = "transport_allowance", precision = 10, scale = 2)
    private BigDecimal transportAllowance = BigDecimal.ZERO;

    @Column(name = "other_allowances", precision = 10, scale = 2)
    private BigDecimal otherAllowances = BigDecimal.ZERO;

    @Column(name = "overtime_hours")
    private Integer overtimeHours = 0;

    @Column(name = "overtime_amount", precision = 10, scale = 2)
    private BigDecimal overtimeAmount = BigDecimal.ZERO;

    @Column(name = "gross_salary", precision = 10, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "pf_deduction", precision = 10, scale = 2)
    private BigDecimal pfDeduction = BigDecimal.ZERO;

    @Column(name = "esi_deduction", precision = 10, scale = 2)
    private BigDecimal esiDeduction = BigDecimal.ZERO;

    @Column(name = "tax_deduction", precision = 10, scale = 2)
    private BigDecimal taxDeduction = BigDecimal.ZERO;

    @Column(name = "professional_tax", precision = 10, scale = 2)
    private BigDecimal professionalTax = BigDecimal.ZERO;

    @Column(name = "loan_deduction", precision = 10, scale = 2)
    private BigDecimal loanDeduction = BigDecimal.ZERO;

    @Column(name = "other_deductions", precision = 10, scale = 2)
    private BigDecimal otherDeductions = BigDecimal.ZERO;

    @Column(name = "total_deductions", precision = 10, scale = 2)
    private BigDecimal totalDeductions;

    @Column(name = "net_salary", precision = 10, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "working_days")
    private Integer workingDays;

    @Column(name = "present_days")
    private Integer presentDays;

    @Column(name = "absent_days")
    private Integer absentDays;

    @Column(name = "leave_days")
    private Integer leaveDays;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PayrollStatus status = PayrollStatus.DRAFT;

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public PayrollRecord() {}

    public PayrollRecord(Employee employee, LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        this.employee = employee;
        this.payPeriodStart = payPeriodStart;
        this.payPeriodEnd = payPeriodEnd;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getPayPeriodStart() {
        return payPeriodStart;
    }

    public void setPayPeriodStart(LocalDate payPeriodStart) {
        this.payPeriodStart = payPeriodStart;
    }

    public LocalDate getPayPeriodEnd() {
        return payPeriodEnd;
    }

    public void setPayPeriodEnd(LocalDate payPeriodEnd) {
        this.payPeriodEnd = payPeriodEnd;
    }

    public BigDecimal getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
    }

    public BigDecimal getHra() {
        return hra;
    }

    public void setHra(BigDecimal hra) {
        this.hra = hra;
    }

    public BigDecimal getDa() {
        return da;
    }

    public void setDa(BigDecimal da) {
        this.da = da;
    }

    public BigDecimal getMedicalAllowance() {
        return medicalAllowance;
    }

    public void setMedicalAllowance(BigDecimal medicalAllowance) {
        this.medicalAllowance = medicalAllowance;
    }

    public BigDecimal getTransportAllowance() {
        return transportAllowance;
    }

    public void setTransportAllowance(BigDecimal transportAllowance) {
        this.transportAllowance = transportAllowance;
    }

    public BigDecimal getOtherAllowances() {
        return otherAllowances;
    }

    public void setOtherAllowances(BigDecimal otherAllowances) {
        this.otherAllowances = otherAllowances;
    }

    public Integer getOvertimeHours() {
        return overtimeHours;
    }

    public void setOvertimeHours(Integer overtimeHours) {
        this.overtimeHours = overtimeHours;
    }

    public BigDecimal getOvertimeAmount() {
        return overtimeAmount;
    }

    public void setOvertimeAmount(BigDecimal overtimeAmount) {
        this.overtimeAmount = overtimeAmount;
    }

    public BigDecimal getGrossSalary() {
        return grossSalary;
    }

    public void setGrossSalary(BigDecimal grossSalary) {
        this.grossSalary = grossSalary;
    }

    public BigDecimal getPfDeduction() {
        return pfDeduction;
    }

    public void setPfDeduction(BigDecimal pfDeduction) {
        this.pfDeduction = pfDeduction;
    }

    public BigDecimal getEsiDeduction() {
        return esiDeduction;
    }

    public void setEsiDeduction(BigDecimal esiDeduction) {
        this.esiDeduction = esiDeduction;
    }

    public BigDecimal getTaxDeduction() {
        return taxDeduction;
    }

    public void setTaxDeduction(BigDecimal taxDeduction) {
        this.taxDeduction = taxDeduction;
    }

    public BigDecimal getProfessionalTax() {
        return professionalTax;
    }

    public void setProfessionalTax(BigDecimal professionalTax) {
        this.professionalTax = professionalTax;
    }

    public BigDecimal getLoanDeduction() {
        return loanDeduction;
    }

    public void setLoanDeduction(BigDecimal loanDeduction) {
        this.loanDeduction = loanDeduction;
    }

    public BigDecimal getOtherDeductions() {
        return otherDeductions;
    }

    public void setOtherDeductions(BigDecimal otherDeductions) {
        this.otherDeductions = otherDeductions;
    }

    public BigDecimal getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(BigDecimal totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public BigDecimal getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(BigDecimal netSalary) {
        this.netSalary = netSalary;
    }

    public Integer getWorkingDays() {
        return workingDays;
    }

    public void setWorkingDays(Integer workingDays) {
        this.workingDays = workingDays;
    }

    public Integer getPresentDays() {
        return presentDays;
    }

    public void setPresentDays(Integer presentDays) {
        this.presentDays = presentDays;
    }

    public Integer getAbsentDays() {
        return absentDays;
    }

    public void setAbsentDays(Integer absentDays) {
        this.absentDays = absentDays;
    }

    public Integer getLeaveDays() {
        return leaveDays;
    }

    public void setLeaveDays(Integer leaveDays) {
        this.leaveDays = leaveDays;
    }

    public PayrollStatus getStatus() {
        return status;
    }

    public void setStatus(PayrollStatus status) {
        this.status = status;
    }

    public LocalDateTime getProcessedDate() {
        return processedDate;
    }

    public void setProcessedDate(LocalDateTime processedDate) {
        this.processedDate = processedDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public enum PayrollStatus {
        DRAFT, CALCULATED, APPROVED, PAID, CANCELLED
    }
}
