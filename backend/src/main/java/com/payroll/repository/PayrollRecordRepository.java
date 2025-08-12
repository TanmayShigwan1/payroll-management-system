package com.payroll.repository;

import com.payroll.model.PayrollRecord;
import com.payroll.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, Long> {
    
    List<PayrollRecord> findByEmployee(Employee employee);
    
    List<PayrollRecord> findByEmployeeId(Long employeeId);
    
    List<PayrollRecord> findByStatus(PayrollRecord.PayrollStatus status);
    
    List<PayrollRecord> findByPayPeriodStartBetween(LocalDate startDate, LocalDate endDate);
    
    Optional<PayrollRecord> findByEmployeeAndPayPeriodStartAndPayPeriodEnd(
        Employee employee, LocalDate payPeriodStart, LocalDate payPeriodEnd);
    
    @Query("SELECT pr FROM PayrollRecord pr WHERE pr.employee.id = :employeeId AND " +
           "pr.payPeriodStart >= :startDate AND pr.payPeriodEnd <= :endDate")
    List<PayrollRecord> findByEmployeeAndPeriod(
        @Param("employeeId") Long employeeId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT pr FROM PayrollRecord pr WHERE " +
           "EXTRACT(YEAR FROM pr.payPeriodStart) = :year AND " +
           "EXTRACT(MONTH FROM pr.payPeriodStart) = :month")
    List<PayrollRecord> findByYearAndMonth(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT pr FROM PayrollRecord pr WHERE pr.employee.department.id = :departmentId AND " +
           "pr.payPeriodStart >= :startDate AND pr.payPeriodEnd <= :endDate")
    List<PayrollRecord> findByDepartmentAndPeriod(
        @Param("departmentId") Long departmentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(pr.netSalary) FROM PayrollRecord pr WHERE " +
           "pr.status = 'PAID' AND " +
           "EXTRACT(YEAR FROM pr.payPeriodStart) = :year AND " +
           "EXTRACT(MONTH FROM pr.payPeriodStart) = :month")
    Double getTotalPayrollCostByMonth(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT COUNT(pr) FROM PayrollRecord pr WHERE " +
           "EXTRACT(YEAR FROM pr.payPeriodStart) = :year AND " +
           "EXTRACT(MONTH FROM pr.payPeriodStart) = :month AND " +
           "pr.status = :status")
    Long countPayrollRecordsByMonthAndStatus(
        @Param("year") int year, @Param("month") int month, @Param("status") PayrollRecord.PayrollStatus status);
}
