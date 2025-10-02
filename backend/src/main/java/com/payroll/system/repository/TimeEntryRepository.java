package com.payroll.system.repository;

import com.payroll.system.model.TimeEntry;
import com.payroll.system.model.TimeEntryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    List<TimeEntry> findByStatus(TimeEntryStatus status);

    List<TimeEntry> findByEmployeeIdAndEntryDateBetweenAndStatus(Long employeeId, LocalDate start, LocalDate end, TimeEntryStatus status);

    @Query("SELECT SUM(COALESCE(t.regularHours, 0)), SUM(COALESCE(t.overtimeHours, 0)) " +
           "FROM TimeEntry t WHERE t.employee.id = :employeeId AND t.entryDate BETWEEN :start AND :end " +
           "AND t.status = :status")
    List<Object[]> sumHoursForEmployee(@Param("employeeId") Long employeeId,
                                       @Param("start") LocalDate start,
                                       @Param("end") LocalDate end,
                                       @Param("status") TimeEntryStatus status);

    @Query("SELECT t FROM TimeEntry t WHERE t.department.id = :departmentId " +
           "AND t.entryDate BETWEEN :start AND :end AND t.status = :status")
    List<TimeEntry> findApprovedByDepartment(@Param("departmentId") Long departmentId,
                                             @Param("start") LocalDate start,
                                             @Param("end") LocalDate end,
                                             @Param("status") TimeEntryStatus status);

    List<TimeEntry> findByDepartmentId(Long departmentId);
}
