package com.payroll.system.dto;

import com.payroll.system.model.TimeEntrySource;
import com.payroll.system.model.TimeEntryStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Request payload for creating or importing time entries without requiring
 * clients to supply polymorphic employee representations.
 */
public class TimeEntryRequest {

    private Long employeeId;
    private Long departmentId;
    private LocalDate entryDate;
    private LocalDateTime clockIn;
    private LocalDateTime clockOut;
    private Double regularHours;
    private Double overtimeHours;
    private TimeEntrySource source;
    private String sourceReference;
    private TimeEntryStatus status;
    private String notes;

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public LocalDateTime getClockIn() {
        return clockIn;
    }

    public void setClockIn(LocalDateTime clockIn) {
        this.clockIn = clockIn;
    }

    public LocalDateTime getClockOut() {
        return clockOut;
    }

    public void setClockOut(LocalDateTime clockOut) {
        this.clockOut = clockOut;
    }

    public Double getRegularHours() {
        return regularHours;
    }

    public void setRegularHours(Double regularHours) {
        this.regularHours = regularHours;
    }

    public Double getOvertimeHours() {
        return overtimeHours;
    }

    public void setOvertimeHours(Double overtimeHours) {
        this.overtimeHours = overtimeHours;
    }

    public TimeEntrySource getSource() {
        return source;
    }

    public void setSource(TimeEntrySource source) {
        this.source = source;
    }

    public String getSourceReference() {
        return sourceReference;
    }

    public void setSourceReference(String sourceReference) {
        this.sourceReference = sourceReference;
    }

    public TimeEntryStatus getStatus() {
        return status;
    }

    public void setStatus(TimeEntryStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
