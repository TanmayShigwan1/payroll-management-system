package com.payroll.system.controller;

import com.payroll.system.exception.ResourceNotFoundException;
import com.payroll.system.model.Employee;
import com.payroll.system.model.HourlyEmployee;
import com.payroll.system.model.SalariedEmployee;
import com.payroll.system.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/hourly")
    public ResponseEntity<HourlyEmployee> createHourlyEmployee(@Valid @RequestBody HourlyEmployee employee) {
        HourlyEmployee createdEmployee = employeeService.createHourlyEmployee(employee);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    @PostMapping("/salaried")
    public ResponseEntity<SalariedEmployee> createSalariedEmployee(@Valid @RequestBody SalariedEmployee employee) {
        SalariedEmployee createdEmployee = employeeService.createSalariedEmployee(employee);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long id) {
        boolean deleted = employeeService.deleteEmployee(id);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", deleted);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchByLastName(@RequestParam String lastName) {
        List<Employee> employees = employeeService.findByLastName(lastName);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Employee> findByEmail(@PathVariable String email) {
        Employee employee = employeeService.findByEmail(email);
        if (employee != null) {
            return ResponseEntity.ok(employee);
        }
        return ResponseEntity.notFound().build();
    }
}