package com.payroll.system.service.impl;

import com.payroll.system.exception.ResourceNotFoundException;
import com.payroll.system.model.Department;
import com.payroll.system.model.Employee;
import com.payroll.system.model.Payroll;
import com.payroll.system.model.SalariedEmployee;
import com.payroll.system.model.TimeEntry;
import com.payroll.system.repository.DepartmentRepository;
import com.payroll.system.repository.EmployeeRepository;
import com.payroll.system.repository.PayrollRepository;
import com.payroll.system.repository.TimeEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private PayrollRepository payrollRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private TimeEntryRepository timeEntryRepository;

    @InjectMocks
    private DepartmentServiceImpl service;

    @BeforeEach
    void setUp() {
        Mockito.reset(departmentRepository, payrollRepository, employeeRepository, timeEntryRepository);
    }

    @Test
    void deleteDepartmentThrowsWhenNotFound() {
        when(departmentRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deleteDepartment(42L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Department");

        verifyNoInteractions(employeeRepository, payrollRepository, timeEntryRepository);
    }

    @Test
    void deleteDepartmentClearsRelatedDataAndDeletes() {
        Department department = new Department();
        department.setId(3L);
        department.setName("Test");

    SalariedEmployee employee = new SalariedEmployee();
    employee.setHireDate(LocalDate.now());
    employee.setDepartment(department);

        Payroll payroll = new Payroll();
        payroll.setDepartment(department);

        TimeEntry timeEntry = new TimeEntry();
        timeEntry.setDepartment(department);

    List<Employee> employees = List.of(employee);
        List<Payroll> payrolls = List.of(payroll);
        List<TimeEntry> timeEntries = List.of(timeEntry);

        when(departmentRepository.findById(3L)).thenReturn(Optional.of(department));
    when(employeeRepository.findByDepartmentId(3L)).thenReturn(employees);
        when(payrollRepository.findByDepartmentIdOrderByPayPeriodStartDesc(3L)).thenReturn(payrolls);
        when(timeEntryRepository.findByDepartmentId(3L)).thenReturn(timeEntries);

        service.deleteDepartment(3L);

        assertThat(employee.getDepartment()).isNull();
        assertThat(payroll.getDepartment()).isNull();
        assertThat(timeEntry.getDepartment()).isNull();

    verify(employeeRepository).saveAll(employees);
        verify(payrollRepository).saveAll(payrolls);
        verify(timeEntryRepository).saveAll(timeEntries);
        verify(departmentRepository).delete(department);
    }
}
