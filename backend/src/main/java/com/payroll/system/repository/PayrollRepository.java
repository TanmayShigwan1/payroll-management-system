package com.payroll.system.repository;

import com.payroll.system.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Payroll entity operations.
 */
@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    /**
     * Find all payrolls for a specific employee.
     */
    List<Payroll> findByEmployeeIdOrderByPayPeriodStartDesc(Long employeeId);
    
    /**
     * Find the latest payroll for an employee.
     */
    Optional<Payroll> findFirstByEmployeeIdOrderByPayPeriodStartDesc(Long employeeId);
    
    /**
     * Check if payroll exists for employee and pay period.
     * This method is called by PayrollServiceImpl.processPayroll()
     */
    @Query("SELECT p FROM Payroll p WHERE p.employee.id = :employeeId " +
           "AND p.payPeriodStart = :payPeriodStart AND p.payPeriodEnd = :payPeriodEnd")
    Optional<Payroll> findByEmployeeAndPayPeriod(@Param("employeeId") Long employeeId,
                                                  @Param("payPeriodStart") LocalDate payPeriodStart,
                                                  @Param("payPeriodEnd") LocalDate payPeriodEnd);
    
    /**
     * Find payrolls by processing date range.
     */
    List<Payroll> findByProcessingDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find all payrolls for the current month.
     */
    @Query("SELECT p FROM Payroll p WHERE MONTH(p.payPeriodStart) = MONTH(CURRENT_DATE) " +
           "AND YEAR(p.payPeriodStart) = YEAR(CURRENT_DATE)")
    List<Payroll> findCurrentMonthPayrolls();

    List<Payroll> findByDepartmentIdOrderByPayPeriodStartDesc(Long departmentId);

    boolean existsByDepartmentId(Long departmentId);

    @Query("SELECT p.department.id, SUM(p.grossPay), SUM(p.netPay), SUM(COALESCE(p.regularHours,0)), " +
           "SUM(COALESCE(p.overtimeHours,0)) FROM Payroll p WHERE p.department.id = :departmentId " +
           "AND p.payPeriodStart BETWEEN :start AND :end GROUP BY p.department.id")
    List<Object[]> summarizeDepartmentPayroll(@Param("departmentId") Long departmentId,
                                              @Param("start") LocalDate start,
                                              @Param("end") LocalDate end);
}
