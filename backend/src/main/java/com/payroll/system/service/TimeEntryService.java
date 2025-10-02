package com.payroll.system.service;

import com.payroll.system.dto.TimeEntryRequest;
import com.payroll.system.model.TimeEntry;
import com.payroll.system.model.TimeEntryStatus;

import java.time.LocalDate;
import java.util.List;

public interface TimeEntryService {

    TimeEntry recordTimeEntry(TimeEntryRequest request);

    List<TimeEntry> importEntries(List<TimeEntryRequest> entries);

    List<TimeEntry> getEntriesForEmployee(Long employeeId, LocalDate start, LocalDate end, TimeEntryStatus status);

    TimeEntry updateStatus(Long timeEntryId, TimeEntryStatus status, String approvedBy);

    void deleteEntry(Long id);
}
