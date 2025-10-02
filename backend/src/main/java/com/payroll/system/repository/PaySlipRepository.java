package com.payroll.system.repository;

import com.payroll.system.model.PaySlip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for PaySlip entity operations.
 */
@Repository
public interface PaySlipRepository extends JpaRepository<PaySlip, Long> {
    
    /**
     * Find payslip by payroll ID.
     * This method is called by PayrollServiceImpl.generatePaySlip()
     */
    Optional<PaySlip> findByPayrollId(Long payrollId);
    
    /**
     * Find all payslips for a specific employee.
     * This method is called by PayrollServiceImpl.getPaySlipsByEmployee()
     */
    List<PaySlip> findByPayrollEmployeeIdOrderByIssueDateDesc(Long employeeId);
    
    /**
     * Find the latest payslip for an employee.
     * This method is called by PayrollServiceImpl.getLatestPaySlipByEmployee()
     */
    @Query("SELECT ps FROM PaySlip ps WHERE ps.payroll.employee.id = :employeeId " +
           "ORDER BY ps.issueDate DESC")
    List<PaySlip> findLatestByEmployeeId(@Param("employeeId") Long employeeId);
    
    /**
     * Find payslips by issue date range.
     */
    List<PaySlip> findByIssueDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find payslip by payslip number.
     */
    Optional<PaySlip> findByPayslipNumber(String payslipNumber);
    
    /**
     * Find all payslips with specific status.
     */
    List<PaySlip> findByStatus(String status);
    
    /**
     * Find all payslips ordered by issue date (latest first).
     */
    List<PaySlip> findAllByOrderByIssueDateDesc();
}
