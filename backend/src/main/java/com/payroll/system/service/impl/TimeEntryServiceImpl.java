package com.payroll.system.service.impl;

import com.payroll.system.dto.TimeEntryRequest;
import com.payroll.system.exception.ResourceNotFoundException;
import com.payroll.system.model.Department;
import com.payroll.system.model.Employee;
import com.payroll.system.model.TimeEntry;
import com.payroll.system.model.TimeEntryStatus;
import com.payroll.system.repository.DepartmentRepository;
import com.payroll.system.repository.EmployeeRepository;
import com.payroll.system.repository.TimeEntryRepository;
import com.payroll.system.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimeEntryServiceImpl implements TimeEntryService {

    private final TimeEntryRepository timeEntryRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public TimeEntryServiceImpl(TimeEntryRepository timeEntryRepository,
                                EmployeeRepository employeeRepository,
                                DepartmentRepository departmentRepository) {
        this.timeEntryRepository = timeEntryRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public TimeEntry recordTimeEntry(TimeEntryRequest request) {
        TimeEntry entry = mapRequestToEntity(request);
        return timeEntryRepository.save(entry);
    }

    @Override
    @Transactional
    public List<TimeEntry> importEntries(List<TimeEntryRequest> entries) {
        if (entries == null || entries.isEmpty()) {
            return List.of();
        }
        List<TimeEntry> saved = new ArrayList<>(entries.size());
        for (TimeEntryRequest request : entries) {
            TimeEntry entry = mapRequestToEntity(request);
            saved.add(timeEntryRepository.save(entry));
        }
        return saved;
    }

    @Override
    public List<TimeEntry> getEntriesForEmployee(Long employeeId, LocalDate start, LocalDate end, TimeEntryStatus status) {
        return timeEntryRepository.findByEmployeeIdAndEntryDateBetweenAndStatus(employeeId, start, end, status);
    }

    @Override
    public TimeEntry updateStatus(Long timeEntryId, TimeEntryStatus status, String approvedBy) {
        TimeEntry entry = timeEntryRepository.findById(timeEntryId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeEntry", "id", timeEntryId));
        entry.setStatus(status);
        if (status == TimeEntryStatus.APPROVED) {
            entry.setApprovedAt(LocalDateTime.now());
            entry.setApprovedBy(approvedBy);
        } else {
            entry.setApprovedAt(null);
            entry.setApprovedBy(null);
        }
        return timeEntryRepository.save(entry);
    }

    @Override
    public void deleteEntry(Long id) {
        if (!timeEntryRepository.existsById(id)) {
            throw new ResourceNotFoundException("TimeEntry", "id", id);
        }
        timeEntryRepository.deleteById(id);
    }

    private TimeEntry mapRequestToEntity(TimeEntryRequest request) {
        if (request == null || request.getEmployeeId() == null) {
            throw new IllegalArgumentException("Time entry must include an employeeId");
        }
        if (request.getEntryDate() == null) {
            throw new IllegalArgumentException("Time entry must include an entryDate");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        TimeEntry entry = new TimeEntry();
        entry.setEmployee(employee);

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        } else {
            department = employee.getDepartment();
        }
        entry.setDepartment(department);

        entry.setEntryDate(request.getEntryDate());
        entry.setClockIn(request.getClockIn());
        entry.setClockOut(request.getClockOut());
        entry.setRegularHours(request.getRegularHours());
        entry.setOvertimeHours(request.getOvertimeHours());
        entry.setSource(request.getSource());
        entry.setSourceReference(request.getSourceReference());
        entry.setStatus(request.getStatus() != null ? request.getStatus() : TimeEntryStatus.PENDING);
        entry.setNotes(request.getNotes());

        return entry;
    }
}
