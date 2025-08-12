package com.payroll.repository;

import com.payroll.model.Employee;
import com.payroll.model.Department;
import com.payroll.model.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByUserId(Long userId);
    
    List<Employee> findByDepartment(Department department);
    
    List<Employee> findByDesignation(Designation designation);
    
    List<Employee> findByEmploymentStatus(Employee.EmploymentStatus employmentStatus);
    
    List<Employee> findByDepartmentId(Long departmentId);
    
    List<Employee> findByDesignationId(Long designationId);
    
    Boolean existsByEmployeeId(String employeeId);
    
    @Query("SELECT e FROM Employee e WHERE e.employmentStatus = 'ACTIVE'")
    List<Employee> findActiveEmployees();
    
    @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId AND e.employmentStatus = 'ACTIVE'")
    List<Employee> findActiveEmployeesByDepartment(@Param("departmentId") Long departmentId);
    
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.user.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.user.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.department.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.designation.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Employee> searchEmployees(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.employmentStatus = 'ACTIVE'")
    Long countActiveEmployees();
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.id = :departmentId AND e.employmentStatus = 'ACTIVE'")
    Long countActiveEmployeesByDepartment(@Param("departmentId") Long departmentId);
}
