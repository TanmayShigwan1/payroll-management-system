package com.payroll.system.service.impl;

import com.payroll.system.exception.ResourceNotFoundException;
import com.payroll.system.model.Employee;
import com.payroll.system.model.HourlyEmployee;
import com.payroll.system.model.SalariedEmployee;
import com.payroll.system.repository.EmployeeRepository;
import com.payroll.system.repository.HourlyEmployeeRepository;
import com.payroll.system.repository.SalariedEmployeeRepository;
import com.payroll.system.service.EmployeeService;
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

    @Autowired
    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            HourlyEmployeeRepository hourlyEmployeeRepository,
            SalariedEmployeeRepository salariedEmployeeRepository) {
        this.employeeRepository = employeeRepository;
        this.hourlyEmployeeRepository = hourlyEmployeeRepository;
        this.salariedEmployeeRepository = salariedEmployeeRepository;
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
        return hourlyEmployeeRepository.save(employee);
    }

    @Override
    public SalariedEmployee createSalariedEmployee(SalariedEmployee employee) {
        return salariedEmployeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        
        // Update basic employee properties
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setAddress(employeeDetails.getAddress());
        employee.setCity(employeeDetails.getCity());
        employee.setState(employeeDetails.getState());
        employee.setZipCode(employeeDetails.getZipCode());
        employee.setTaxId(employeeDetails.getTaxId());
        
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
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
}