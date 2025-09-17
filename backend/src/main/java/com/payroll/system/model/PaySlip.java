package com.payroll.system.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity class to store generated payslip records.
 */
@Entity
@Table(name = "pay_slips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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