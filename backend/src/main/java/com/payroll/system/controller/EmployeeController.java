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

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Employee>> getByDepartment(@PathVariable Long departmentId) {
        List<Employee> employees = employeeService.getEmployeesByDepartment(departmentId);
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
        return employeeService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update employee status (Active, On Leave, Terminated)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateEmployeeStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            
            // Validate status value
            if (newStatus == null || newStatus.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Status cannot be empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate against allowed status values
            if (!List.of("Active", "On Leave", "Terminated").contains(newStatus)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid status value. Allowed values: Active, On Leave, Terminated");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            Employee updatedEmployee = employeeService.updateEmployeeStatus(id, newStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Status updated successfully");
            response.put("employeeId", id);
            response.put("newStatus", newStatus);
            response.put("employee", updatedEmployee);
            
            return ResponseEntity.ok(response);
            
        } catch (ResourceNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Employee not found");
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update employee status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}/department")
    public ResponseEntity<Employee> assignDepartment(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long departmentId = payload.get("departmentId");
        if (departmentId == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Employee updated = employeeService.assignDepartment(id, departmentId);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}