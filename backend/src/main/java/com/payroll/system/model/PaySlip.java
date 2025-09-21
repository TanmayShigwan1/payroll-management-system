package com.payroll.system.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity class to store generated payslip records.
 */
@Entity
@Table(name = "pay_slips")
public class PaySlip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "payroll_id", nullable = false, unique = true)
    private Payroll payroll;
    
    @Column(name = "payslip_number", unique = true, nullable = false)
    private String payslipNumber;
    
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;
    
    @Column(name = "payment_date")
    private LocalDate paymentDate;
    
    @Column(name = "bank_account_number")
    private String bankAccountNumber;
    
    @Column(name = "bank_routing_number")
    private String bankRoutingNumber;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "generated_timestamp")
    private LocalDateTime generatedTimestamp;

    // Constructors
    public PaySlip() {}

    public PaySlip(Payroll payroll, String payslipNumber, LocalDate issueDate) {
        this.payroll = payroll;
        this.payslipNumber = payslipNumber;
        this.issueDate = issueDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Payroll getPayroll() { return payroll; }
    public void setPayroll(Payroll payroll) { this.payroll = payroll; }

    public String getPayslipNumber() { return payslipNumber; }
    public void setPayslipNumber(String payslipNumber) { this.payslipNumber = payslipNumber; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public String getBankRoutingNumber() { return bankRoutingNumber; }
    public void setBankRoutingNumber(String bankRoutingNumber) { this.bankRoutingNumber = bankRoutingNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getGeneratedTimestamp() { return generatedTimestamp; }
    public void setGeneratedTimestamp(LocalDateTime generatedTimestamp) { this.generatedTimestamp = generatedTimestamp; }
    
    @PrePersist
    public void prePersist() {
        if (generatedTimestamp == null) {
            generatedTimestamp = LocalDateTime.now();
        }
        
        if (issueDate == null) {
            issueDate = LocalDate.now();
        }
        
        if (payslipNumber == null) {
            // Generate a unique payslip number based on employee ID, year, month, and a random number
            String employeeId = payroll.getEmployee().getId().toString();
            String yearMonth = LocalDate.now().getYear() + "" + LocalDate.now().getMonthValue();
            String randomPart = String.format("%04d", (int) (Math.random() * 10000));
            payslipNumber = "PS-" + employeeId + "-" + yearMonth + "-" + randomPart;
        }
    }
}