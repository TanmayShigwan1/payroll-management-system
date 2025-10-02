package com.payroll.system.dto;

import java.math.BigDecimal;

/**
 * Aggregated payroll totals for a single department.
 */
public class DepartmentPayrollSummary {
    private Long departmentId;
    private String departmentName;
    private String costCenter;
    private BigDecimal totalGrossPay;
    private BigDecimal totalNetPay;
    private Double totalRegularHours;
    private Double totalOvertimeHours;

    public DepartmentPayrollSummary() {
    }

    public DepartmentPayrollSummary(Long departmentId, String departmentName, String costCenter,
                                    BigDecimal totalGrossPay, BigDecimal totalNetPay,
                                    Double totalRegularHours, Double totalOvertimeHours) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.costCenter = costCenter;
        this.totalGrossPay = totalGrossPay;
        this.totalNetPay = totalNetPay;
        this.totalRegularHours = totalRegularHours;
        this.totalOvertimeHours = totalOvertimeHours;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getCostCenter() {
        return costCenter;
    }

    public void setCostCenter(String costCenter) {
        this.costCenter = costCenter;
    }

    public BigDecimal getTotalGrossPay() {
        return totalGrossPay;
    }

    public void setTotalGrossPay(BigDecimal totalGrossPay) {
        this.totalGrossPay = totalGrossPay;
    }

    public BigDecimal getTotalNetPay() {
        return totalNetPay;
    }

    public void setTotalNetPay(BigDecimal totalNetPay) {
        this.totalNetPay = totalNetPay;
    }

    public Double getTotalRegularHours() {
        return totalRegularHours;
    }

    public void setTotalRegularHours(Double totalRegularHours) {
        this.totalRegularHours = totalRegularHours;
    }

    public Double getTotalOvertimeHours() {
        return totalOvertimeHours;
    }

    public void setTotalOvertimeHours(Double totalOvertimeHours) {
        this.totalOvertimeHours = totalOvertimeHours;
    }
}
