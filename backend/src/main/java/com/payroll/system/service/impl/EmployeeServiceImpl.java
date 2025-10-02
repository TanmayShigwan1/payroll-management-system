package com.payroll.system.service.impl;

import com.payroll.system.exception.ResourceNotFoundException;
import com.payroll.system.model.Department;
import com.payroll.system.model.Employee;
import com.payroll.system.model.HourlyEmployee;
import com.payroll.system.model.SalariedEmployee;
import com.payroll.system.repository.DepartmentRepository;
import com.payroll.system.repository.EmployeeRepository;
import com.payroll.system.repository.HourlyEmployeeRepository;
import com.payroll.system.repository.SalariedEmployeeRepository;
import com.payroll.system.service.EmployeeService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of the EmployeeService interface.
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final HourlyEmployeeRepository hourlyEmployeeRepository;
    private final SalariedEmployeeRepository salariedEmployeeRepository;
    private final DepartmentRepository departmentRepository;
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            HourlyEmployeeRepository hourlyEmployeeRepository,
            SalariedEmployeeRepository salariedEmployeeRepository,
            DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.hourlyEmployeeRepository = hourlyEmployeeRepository;
        this.salariedEmployeeRepository = salariedEmployeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    @Override
    public HourlyEmployee createHourlyEmployee(HourlyEmployee employee) {
        resolveAndSetDepartment(employee);
        return hourlyEmployeeRepository.save(employee);
    }

    @Override
    public SalariedEmployee createSalariedEmployee(SalariedEmployee employee) {
        resolveAndSetDepartment(employee);
        return salariedEmployeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        
        // Update basic employee properties
        applyCommonUpdates(employee, employeeDetails);
        syncDepartment(employee, employeeDetails.getDepartment());

        // Handle type conversion (Salaried <-> Hourly)
        if (!employee.getClass().equals(employeeDetails.getClass())) {
            Employee converted = convertEmployeeType(employee, employeeDetails);
            detachIfManaged(employee);
            return employeeRepository.save(converted);
        }
        
        // Handle specific employee type updates
        if (employee instanceof HourlyEmployee && employeeDetails instanceof HourlyEmployee) {
            HourlyEmployee hourlyEmployee = (HourlyEmployee) employee;
            HourlyEmployee updatedDetails = (HourlyEmployee) employeeDetails;
            
            hourlyEmployee.setHourlyRate(updatedDetails.getHourlyRate());
            hourlyEmployee.setHoursWorked(updatedDetails.getHoursWorked());
            hourlyEmployee.setOvertimeHours(updatedDetails.getOvertimeHours());
            hourlyEmployee.setOvertimeRateMultiplier(updatedDetails.getOvertimeRateMultiplier());
            
            return hourlyEmployeeRepository.save(hourlyEmployee);
        } else if (employee instanceof SalariedEmployee && employeeDetails instanceof SalariedEmployee) {
            SalariedEmployee salariedEmployee = (SalariedEmployee) employee;
            SalariedEmployee updatedDetails = (SalariedEmployee) employeeDetails;
            
            salariedEmployee.setAnnualSalary(updatedDetails.getAnnualSalary());
            salariedEmployee.setBonusPercentage(updatedDetails.getBonusPercentage());
            
            return salariedEmployeeRepository.save(salariedEmployee);
        }
        
        // If we can't do specific type updates, at least save the basic details
    return employeeRepository.save(employee);
    }

    @Override
    public boolean deleteEmployee(Long id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Employee> findByLastName(String lastName) {
        return employeeRepository.findByLastName(lastName);
    }

    @Override
    public Optional<Employee> findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    @Override
    public Employee updateEmployeeStatus(Long id, String newStatus) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        
        // Log status change for audit trail
        String currentStatus = employee.getStatus();
        System.out.println("Updating employee " + id + " status from " + currentStatus + " to " + newStatus);
        
        employee.setStatus(newStatus);
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    @Override
    public Employee assignDepartment(Long employeeId, Long departmentId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));

        employee.setDepartment(department);
        return employeeRepository.save(employee);
    }

    private void resolveAndSetDepartment(Employee employee) {
        if (employee.getDepartment() == null || employee.getDepartment().getId() == null) {
            return;
        }

        Long departmentId = employee.getDepartment().getId();
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));
        employee.setDepartment(department);
    }

    private void syncDepartment(Employee employee, Department providedDepartment) {
        if (providedDepartment == null) {
            employee.setDepartment(null);
            return;
        }

        Long departmentId = providedDepartment.getId();
        if (departmentId == null) {
            employee.setDepartment(null);
            return;
        }

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));
        employee.setDepartment(department);
    }

    private void applyCommonUpdates(Employee target, Employee source) {
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setEmail(source.getEmail());
        target.setPhoneNumber(source.getPhoneNumber());
        target.setAddress(source.getAddress());
        target.setCity(source.getCity());
        target.setState(source.getState());
        target.setZipCode(source.getZipCode());
        target.setTaxId(source.getTaxId());
        if (source.getHireDate() != null) {
            target.setHireDate(source.getHireDate());
        }
    }

    private Employee convertEmployeeType(Employee updated, Employee requestedTypeDetails) {
        if (requestedTypeDetails instanceof HourlyEmployee) {
            HourlyEmployee hourly = new HourlyEmployee();
            copyCommonProperties(updated, hourly);

            HourlyEmployee details = (HourlyEmployee) requestedTypeDetails;
            hourly.setHourlyRate(details.getHourlyRate());
            hourly.setHoursWorked(details.getHoursWorked());
            hourly.setOvertimeHours(details.getOvertimeHours());
            hourly.setOvertimeRateMultiplier(details.getOvertimeRateMultiplier());
            return hourly;
        } else if (requestedTypeDetails instanceof SalariedEmployee) {
            SalariedEmployee salaried = new SalariedEmployee();
            copyCommonProperties(updated, salaried);

            SalariedEmployee details = (SalariedEmployee) requestedTypeDetails;
            salaried.setAnnualSalary(details.getAnnualSalary());
            salaried.setBonusPercentage(details.getBonusPercentage());
            return salaried;
        }
        return updated;
    }

    private void copyCommonProperties(Employee source, Employee target) {
        target.setId(source.getId());
        target.setFirstName(source.getFirstName());
        target.setLastName(source.getLastName());
        target.setEmail(source.getEmail());
        target.setPhoneNumber(source.getPhoneNumber());
        target.setAddress(source.getAddress());
        target.setCity(source.getCity());
        target.setState(source.getState());
        target.setZipCode(source.getZipCode());
        target.setTaxId(source.getTaxId());
        target.setHireDate(source.getHireDate());
        target.setStatus(source.getStatus());
        target.setDepartment(source.getDepartment());
    }

    private void detachIfManaged(Employee employee) {
        if (entityManager.contains(employee)) {
            entityManager.detach(employee);
        }
    }
}