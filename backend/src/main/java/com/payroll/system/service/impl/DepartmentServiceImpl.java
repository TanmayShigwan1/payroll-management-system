package com.payroll.system.service.impl;

import com.payroll.system.dto.DepartmentPayrollSummary;
import com.payroll.system.exception.ResourceNotFoundException;
import com.payroll.system.model.Department;
import com.payroll.system.model.Employee;
import com.payroll.system.model.Payroll;
import com.payroll.system.model.TimeEntry;
import com.payroll.system.repository.DepartmentRepository;
import com.payroll.system.repository.EmployeeRepository;
import com.payroll.system.repository.PayrollRepository;
import com.payroll.system.repository.TimeEntryRepository;
import com.payroll.system.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final TimeEntryRepository timeEntryRepository;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository,
                                 PayrollRepository payrollRepository,
                                 EmployeeRepository employeeRepository,
                                 TimeEntryRepository timeEntryRepository) {
        this.departmentRepository = departmentRepository;
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.timeEntryRepository = timeEntryRepository;
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Optional<Department> getDepartment(Long id) {
        return departmentRepository.findById(id);
    }

    @Override
    public Department createDepartment(Department department) {
        departmentRepository.findByNameIgnoreCase(department.getName()).ifPresent(existing -> {
            throw new IllegalStateException("Department name already in use");
        });
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Long id, Department update) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        departmentRepository.findByNameIgnoreCase(update.getName())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new IllegalStateException("Department name already in use");
                });

        existing.setName(update.getName());
        existing.setCostCenter(update.getCostCenter());
        existing.setDescription(update.getDescription());
        return departmentRepository.save(existing);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

    List<Employee> employees = employeeRepository.findByDepartmentId(id);
        if (!employees.isEmpty()) {
            employees.forEach(employee -> employee.setDepartment(null));
            employeeRepository.saveAll(employees);
        }

    List<Payroll> payrolls = payrollRepository.findByDepartmentIdOrderByPayPeriodStartDesc(id);
        if (!payrolls.isEmpty()) {
            payrolls.forEach(payroll -> payroll.setDepartment(null));
            payrollRepository.saveAll(payrolls);
        }

    List<TimeEntry> timeEntries = timeEntryRepository.findByDepartmentId(id);
        if (!timeEntries.isEmpty()) {
            timeEntries.forEach(timeEntry -> timeEntry.setDepartment(null));
            timeEntryRepository.saveAll(timeEntries);
        }

        departmentRepository.delete(department);
    }

    @Override
    public DepartmentPayrollSummary summarizePayroll(Long departmentId, LocalDate start, LocalDate end) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));

        List<Object[]> rows = payrollRepository.summarizeDepartmentPayroll(departmentId, start, end);

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        double totalRegularHours = 0.0;
        double totalOvertimeHours = 0.0;

        if (!rows.isEmpty()) {
            Object[] result = rows.get(0);
            totalGross = toBigDecimal(result[1]);
            totalNet = toBigDecimal(result[2]);
            totalRegularHours = result[3] != null ? ((Number) result[3]).doubleValue() : 0.0;
            totalOvertimeHours = result[4] != null ? ((Number) result[4]).doubleValue() : 0.0;
        }

        return new DepartmentPayrollSummary(
                department.getId(),
                department.getName(),
                department.getCostCenter(),
                totalGross,
                totalNet,
                totalRegularHours,
                totalOvertimeHours
        );
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return BigDecimal.ZERO;
    }
}
