package com.payroll.system.controller;

import com.payroll.system.model.Payroll;
import com.payroll.system.model.PaySlip;
import com.payroll.system.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for payroll processing operations.
 * This provides endpoints for standardized payroll calculations and payslip generation.
 */
@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;
    
    @Autowired
    private com.payroll.system.service.ExcelService excelService;

    /**
     * Process payroll for an employee - SINGLE SOURCE OF TRUTH
     */
    @PostMapping("/process")
    public ResponseEntity<?> processPayroll(@RequestBody Map<String, Object> request) {
        try {
            Long employeeId = Long.valueOf(request.get("employeeId").toString());
            LocalDate payPeriodStart = LocalDate.parse(request.get("payPeriodStart").toString());
            LocalDate payPeriodEnd = LocalDate.parse(request.get("payPeriodEnd").toString());
            
            Payroll payroll = payrollService.processPayroll(employeeId, payPeriodStart, payPeriodEnd);
            
            // Also generate payslip immediately
            PaySlip paySlip = payrollService.generatePaySlip(payroll.getId());
            
            // Return complete payroll information
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payroll processed successfully",
                "payroll", payroll,
                "payslip", paySlip
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Get payroll by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable Long id) {
        try {
            Payroll payroll = payrollService.getPayrollById(id);
            return ResponseEntity.ok(payroll);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all payrolls for an employee
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollsByEmployee(@PathVariable Long employeeId) {
        try {
            List<Payroll> payrolls = payrollService.getPayrollsByEmployee(employeeId);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all payrolls for a department
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Payroll>> getPayrollsByDepartment(@PathVariable Long departmentId) {
        try {
            List<Payroll> payrolls = payrollService.getPayrollsByDepartment(departmentId);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get payslip by ID
     */
    @GetMapping("/payslip/{id}")
    public ResponseEntity<PaySlip> getPaySlipById(@PathVariable Long id) {
        try {
            PaySlip paySlip = payrollService.getPaySlipById(id);
            return ResponseEntity.ok(paySlip);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get latest payslip for an employee
     */
    @GetMapping("/payslip/employee/{employeeId}/latest")
    public ResponseEntity<PaySlip> getLatestPaySlipByEmployee(@PathVariable Long employeeId) {
        try {
            PaySlip paySlip = payrollService.getLatestPaySlipByEmployee(employeeId);
            return ResponseEntity.ok(paySlip);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all payslips for an employee
     */
    @GetMapping("/payslip/employee/{employeeId}")
    public ResponseEntity<List<PaySlip>> getPaySlipsByEmployee(@PathVariable Long employeeId) {
        try {
            List<PaySlip> paySlips = payrollService.getPaySlipsByEmployee(employeeId);
            return ResponseEntity.ok(paySlips);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Generate payslip for existing payroll
     */
    @PostMapping("/payslip/generate/{payrollId}")
    public ResponseEntity<?> generatePaySlip(@PathVariable Long payrollId) {
        try {
            PaySlip paySlip = payrollService.generatePaySlip(payrollId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payslip generated successfully",
                "payslip", paySlip
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Get all payslips
     */
    @GetMapping("/payslips")
    public ResponseEntity<List<PaySlip>> getAllPaySlips() {
        try {
            List<PaySlip> paySlips = payrollService.getAllPaySlips();
            return ResponseEntity.ok(paySlips);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Export all payslips to Excel
     */
    @GetMapping("/payslips/export/excel")
    public ResponseEntity<byte[]> exportPaySlipsToExcel() {
        try {
            System.out.println("Excel export endpoint called");
            List<PaySlip> paySlips = payrollService.getAllPaySlips();
            System.out.println("Found " + paySlips.size() + " payslips to export");
            
            byte[] excelData = excelService.exportPaySlipsToExcel(paySlips);
            System.out.println("Excel data generated, size: " + excelData.length + " bytes");
            
            String filename = "payslips_" + LocalDate.now().toString() + ".xlsx";
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + filename)
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(excelData);
                    
        } catch (Exception e) {
            System.err.println("Error exporting to Excel: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Export payslips for specific employee to Excel
     */
    @GetMapping("/payslips/employee/{employeeId}/export/excel")
    public ResponseEntity<byte[]> exportEmployeePaySlipsToExcel(@PathVariable Long employeeId) {
        try {
            List<PaySlip> paySlips = payrollService.getPaySlipsByEmployee(employeeId);
            byte[] excelData = excelService.exportPaySlipsToExcel(paySlips);
            
            String filename = "employee_" + employeeId + "_payslips_" + LocalDate.now().toString() + ".xlsx";
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + filename)
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(excelData);
                    
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Test endpoint to verify controller is working
     */
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Payroll controller is working",
            "timestamp", LocalDate.now().toString()
        ));
    }
}