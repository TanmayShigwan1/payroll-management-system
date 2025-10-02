package com.payroll.system.service;

import com.payroll.system.model.Employee;
import com.payroll.system.model.Payroll;
import com.payroll.system.model.PaySlip;
import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for payroll processing operations.
 */
public interface PayrollService {
    
    /**
     * Process payroll for an employee for a specific pay period.
     * This method performs the standardized calculation and saves the results.
     */
    Payroll processPayroll(Long employeeId, LocalDate payPeriodStart, LocalDate payPeriodEnd);
    
    /**
     * Generate a payslip for a processed payroll.
     */
    PaySlip generatePaySlip(Long payrollId);
    
    /**
     * Get payroll by ID.
     */
    Payroll getPayrollById(Long id);
    
    /**
     * Get all payrolls for an employee.
     */
    List<Payroll> getPayrollsByEmployee(Long employeeId);

    /**
     * Get all payrolls for a department.
     */
    List<Payroll> getPayrollsByDepartment(Long departmentId);
    
    /**
     * Get payslip by ID.
     */
    PaySlip getPaySlipById(Long id);
    
    /**
     * Get payslip by employee ID (latest).
     */
    PaySlip getLatestPaySlipByEmployee(Long employeeId);
    
    /**
     * Get all payslips for an employee.
     */
    List<PaySlip> getPaySlipsByEmployee(Long employeeId);
    
    /**
     * Get all payslips in the system.
     */
    List<PaySlip> getAllPaySlips();

    
    /**
     * Calculate gross pay for an employee (standardized calculation).
     */
    double calculateGrossPay(Employee employee, LocalDate payPeriodStart, LocalDate payPeriodEnd);
    
    /**
     * Calculate deductions for gross pay (standardized calculation).
     */
    Object calculateDeductions(double grossPay);
}