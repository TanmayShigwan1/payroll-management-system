package com.payroll.system.service;

import com.payroll.system.dto.DepartmentPayrollSummary;
import com.payroll.system.model.Department;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DepartmentService {

    List<Department> getAllDepartments();

    Optional<Department> getDepartment(Long id);

    Department createDepartment(Department department);

    Department updateDepartment(Long id, Department department);

    void deleteDepartment(Long id);

    DepartmentPayrollSummary summarizePayroll(Long departmentId, LocalDate start, LocalDate end);
}
