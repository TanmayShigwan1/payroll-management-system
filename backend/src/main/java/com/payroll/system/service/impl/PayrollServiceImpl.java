package com.payroll.system.service.impl;

import com.payroll.system.exception.ResourceNotFoundException;
import com.payroll.system.model.Employee;
import com.payroll.system.model.HourlyEmployee;
import com.payroll.system.model.Payroll;
import com.payroll.system.model.PaySlip;
import com.payroll.system.model.SalariedEmployee;
import com.payroll.system.repository.EmployeeRepository;
import com.payroll.system.repository.PayrollRepository;
import com.payroll.system.repository.PaySlipRepository;
import com.payroll.system.repository.TimeEntryRepository;
import com.payroll.system.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of PayrollService with standardized Indian payroll calculations.
 * This is the SINGLE SOURCE OF TRUTH for all payroll calculations.
 */
@Service
public class PayrollServiceImpl implements PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;
    
    @Autowired
    private PaySlipRepository paySlipRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    /**
     * STANDARDIZED PAYROLL PROCESSING - Single source of truth for calculations
     */
    @Override
    public Payroll processPayroll(Long employeeId, LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        // Get employee
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        
        // Check if payroll already exists for this period
        Optional<Payroll> existingPayroll = payrollRepository.findByEmployeeAndPayPeriod(
                employeeId, payPeriodStart, payPeriodEnd);
        
        if (existingPayroll.isPresent()) {
            throw new RuntimeException("Payroll already processed for this employee and pay period");
        }
        
        // Calculate gross pay using standardized logic
        double grossPay = calculateGrossPay(employee, payPeriodStart, payPeriodEnd);
        
        // Calculate deductions using standardized logic - simplified approach
        double incomeTax = grossPay * 0.10;        // 10% income tax (simplified)
        double providentFund = grossPay * 0.12;    // 12% PF (Employee contribution)
        double esi = grossPay * 0.0075;            // 0.75% ESI (Employee contribution)
        double professionalTax = 200.0;            // Fixed ₹200 professional tax
        double healthInsurance = 1500.0;           // Fixed ₹1500 health insurance
        double retirementContribution = grossPay * 0.05; // 5% retirement/gratuity
        
        double totalDeductions = incomeTax + providentFund + esi + professionalTax + healthInsurance + retirementContribution;
        double netPay = grossPay - totalDeductions;
        
        // Create and save payroll record
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setPayPeriodStart(payPeriodStart);
        payroll.setPayPeriodEnd(payPeriodEnd);
        payroll.setGrossPay(grossPay);
        payroll.setIncomeTax(incomeTax);
        payroll.setProvidentFund(providentFund);
        payroll.setEsi(esi);
        payroll.setProfessionalTax(professionalTax);
        payroll.setHealthInsurance(healthInsurance);
        payroll.setRetirementContribution(retirementContribution);
        payroll.setOtherDeductions(0.0); // No other deductions for now
        payroll.setNetPay(netPay);
        payroll.setProcessingDate(LocalDate.now());
        payroll.setPaymentMethod("Bank Transfer");
        payroll.setNotes("Processed by Payroll Management System");
        payroll.setDepartment(employee.getDepartment());
        setHoursFromTimeEntries(payroll, employee, payPeriodStart, payPeriodEnd);
        
        return payrollRepository.save(payroll);
    }

    /**
     * STANDARDIZED GROSS PAY CALCULATION - Single source of truth
     */
    @Override
    public double calculateGrossPay(Employee employee, LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        double grossPay = 0.0;

        if (employee instanceof SalariedEmployee) {
            SalariedEmployee salariedEmployee = (SalariedEmployee) employee;
            if (salariedEmployee.getAnnualSalary() != null && salariedEmployee.getAnnualSalary() > 0) {
                grossPay = salariedEmployee.getAnnualSalary() / 12.0;
            }
        } else if (employee instanceof HourlyEmployee) {
            HourlyEmployee hourlyEmployee = (HourlyEmployee) employee;
            if (hourlyEmployee.getHourlyRate() != null && hourlyEmployee.getHourlyRate() > 0) {
                double hoursWorked = hourlyEmployee.getHoursWorked() != null ? hourlyEmployee.getHoursWorked() : 160.0;
                double overtimeHours = hourlyEmployee.getOvertimeHours() != null ? hourlyEmployee.getOvertimeHours() : 0.0;
                
                double regularPay = hourlyEmployee.getHourlyRate() * hoursWorked;
                double overtimePay = hourlyEmployee.getHourlyRate() * 1.5 * overtimeHours;
                grossPay = regularPay + overtimePay;
            }
        }

        return Math.round(grossPay * 100.0) / 100.0;
    }

    private void setHoursFromTimeEntries(Payroll payroll, Employee employee, LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        double regular = 0.0;
        double overtime = 0.0;

        List<Object[]> totals = timeEntryRepository.sumHoursForEmployee(
                employee.getId(),
                payPeriodStart,
                payPeriodEnd,
                com.payroll.system.model.TimeEntryStatus.APPROVED
        );

        if (totals != null && !totals.isEmpty()) {
            Object[] row = totals.get(0);
            if (row != null) {
                if (row.length > 0 && row[0] instanceof Number number) {
                    regular = number.doubleValue();
                }
                if (row.length > 1 && row[1] instanceof Number number) {
                    overtime = number.doubleValue();
                }
            }
        }

        payroll.setRegularHours(Math.round(regular * 100.0) / 100.0);
        payroll.setOvertimeHours(Math.round(overtime * 100.0) / 100.0);
    }

    /**
     * STANDARDIZED DEDUCTIONS CALCULATION - Single source of truth
     * Using Indian tax structure - simplified without complex DTO
     */
    @Override
    public Object calculateDeductions(double grossPay) {
        // This method is kept for interface compliance but calculation is done inline
        // in processPayroll method for simplicity
        return null;
    }

    @Override
    public PaySlip generatePaySlip(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll", "id", payrollId));
        
        // Check if payslip already exists
        Optional<PaySlip> existingPaySlip = paySlipRepository.findByPayrollId(payrollId);
        if (existingPaySlip.isPresent()) {
            return existingPaySlip.get();
        }
        
        // Generate payslip
        PaySlip paySlip = new PaySlip();
        paySlip.setPayroll(payroll);
        paySlip.setIssueDate(LocalDate.now());
        paySlip.setPaymentDate(LocalDate.now().plusDays(7)); // Payment 7 days after issue
        paySlip.setBankAccountNumber("XXXX-XXXX-" + String.format("%04d", payroll.getEmployee().getId()));
        paySlip.setStatus("Generated");
        
        // Generate unique payslip number
        String payslipNumber = generatePaySlipNumber(payroll.getEmployee().getId(), payroll.getPayPeriodStart());
        paySlip.setPayslipNumber(payslipNumber);
        
        return paySlipRepository.save(paySlip);
    }

    @Override
    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll", "id", id));
    }

    @Override
    public List<Payroll> getPayrollsByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeIdOrderByPayPeriodStartDesc(employeeId);
    }

    @Override
    public List<Payroll> getPayrollsByDepartment(Long departmentId) {
        return payrollRepository.findByDepartmentIdOrderByPayPeriodStartDesc(departmentId);
    }

    @Override
    public PaySlip getPaySlipById(Long id) {
        return paySlipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaySlip", "id", id));
    }

    @Override
    public PaySlip getLatestPaySlipByEmployee(Long employeeId) {
        List<PaySlip> paySlips = paySlipRepository.findByPayrollEmployeeIdOrderByIssueDateDesc(employeeId);
        if (paySlips.isEmpty()) {
            throw new ResourceNotFoundException("PaySlip", "employee_id", employeeId);
        }
        return paySlips.get(0); // Get the first (latest) payslip
    }

    @Override
    public List<PaySlip> getPaySlipsByEmployee(Long employeeId) {
        return paySlipRepository.findByPayrollEmployeeIdOrderByIssueDateDesc(employeeId);
    }

    @Override
    public List<PaySlip> getAllPaySlips() {
        return paySlipRepository.findAllByOrderByIssueDateDesc();
    }

    /**
     * Generate unique payslip number
     */
    private String generatePaySlipNumber(Long employeeId, LocalDate payPeriodStart) {
        String yearMonth = payPeriodStart.format(DateTimeFormatter.ofPattern("yyyyMM"));
        String randomPart = String.format("%04d", (int) (Math.random() * 10000));
        return "PS-" + employeeId + "-" + yearMonth + "-" + randomPart;
    }


}
