package com.payroll.system.controller;

import com.payroll.system.dto.TimeEntryRequest;
import com.payroll.system.model.TimeEntry;
import com.payroll.system.model.TimeEntryStatus;
import com.payroll.system.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/time-entries")
public class TimeEntryController {

    private final TimeEntryService timeEntryService;

    @Autowired
    public TimeEntryController(TimeEntryService timeEntryService) {
        this.timeEntryService = timeEntryService;
    }

    @PostMapping
    public ResponseEntity<TimeEntry> record(@RequestBody TimeEntryRequest timeEntry) {
        try {
            return ResponseEntity.ok(timeEntryService.recordTimeEntry(timeEntry));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/import")
    public ResponseEntity<List<TimeEntry>> bulkImport(@RequestBody List<TimeEntryRequest> entries) {
        try {
            return ResponseEntity.ok(timeEntryService.importEntries(entries));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<TimeEntry>> byEmployee(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(required = false) TimeEntryStatus status) {
        TimeEntryStatus effectiveStatus = status != null ? status : TimeEntryStatus.APPROVED;
        return ResponseEntity.ok(timeEntryService.getEntriesForEmployee(employeeId, start, end, effectiveStatus));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TimeEntry> approve(@PathVariable Long id,
                                             @RequestParam TimeEntryStatus status,
                                             @RequestParam(required = false) String approvedBy) {
        try {
            return ResponseEntity.ok(timeEntryService.updateStatus(id, status, approvedBy));
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            timeEntryService.deleteEntry(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
