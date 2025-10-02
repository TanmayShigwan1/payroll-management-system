import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import { employeeService, timeEntryService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { toast } from 'react-toastify';

const statusVariant = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger'
};

const buildDefaultRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toISO = (date) => date.toISOString().split('T')[0];
  return {
    start: toISO(start),
    end: toISO(end)
  };
};

const TimeEntryManager = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateRange, setDateRange] = useState(buildDefaultRange());
  const [statusFilter, setStatusFilter] = useState('APPROVED');
  const [fetchingEntries, setFetchingEntries] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeData = await employeeService.getAllEmployees();
        setEmployees(employeeData);
        if (employeeData.length > 0) {
          setSelectedEmployee(String(employeeData[0].id));
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load employees', err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const selectedEmployeeName = useMemo(() => {
    if (!selectedEmployee) {
      return '';
    }
    const employee = employees.find((emp) => String(emp.id) === String(selectedEmployee));
    if (!employee) {
      return '';
    }
    return `${employee.firstName} ${employee.lastName}`;
  }, [employees, selectedEmployee]);

  const fetchEntries = async () => {
    if (!selectedEmployee || !dateRange.start || !dateRange.end) {
      toast.error('Employee and date range are required');
      return;
    }

    try {
      setFetchingEntries(true);
      const entries = await timeEntryService.getEntriesForEmployee(selectedEmployee, {
        startDate: dateRange.start,
        endDate: dateRange.end,
        status: statusFilter
      });
      setTimeEntries(entries);
    } catch (err) {
      console.error('Failed to load time entries', err);
      toast.error('Failed to load time entries');
    } finally {
      setFetchingEntries(false);
    }
  };

  const updateEntryStatus = async (entryId, newStatus) => {
    try {
      await timeEntryService.updateStatus(entryId, newStatus, 'Admin');
      toast.success(`Entry ${entryId} marked as ${newStatus}`);
      setTimeEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, status: newStatus } : entry
        )
      );
    } catch (err) {
      console.error('Failed to update time entry status', err);
      toast.error('Failed to update time entry status');
    }
  };

  const deleteEntry = async (entryId) => {
    const confirmed = window.confirm('Delete this time entry? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      await timeEntryService.deleteEntry(entryId);
      toast.success('Time entry deleted');
      setTimeEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (err) {
      console.error('Failed to delete time entry', err);
      toast.error('Failed to delete time entry');
    }
  };

  const handleRefresh = (event) => {
    event.preventDefault();
    fetchEntries();
  };

  if (loading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="time-entry-manager">
      <h2 className="mb-4">Time & Attendance</h2>
      <Form onSubmit={handleRefresh}>
        <Card className="mb-4">
          <Card.Header>Filters</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Employee</Form.Label>
                  <Form.Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="primary" disabled={fetchingEntries}>
                {fetchingEntries ? 'Loading...' : 'Load Time Entries'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>

      <Card>
        <Card.Header>
          {selectedEmployeeName ? `Entries for ${selectedEmployeeName}` : 'Time Entries'}
        </Card.Header>
        <Card.Body>
          {fetchingEntries ? (
            <LoadingSpinner message="Loading time entries..." />
          ) : timeEntries.length === 0 ? (
            <p className="text-muted mb-0">No time entries found for the selected filters.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Regular Hours</th>
                  <th>Overtime Hours</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.entryDate}</td>
                    <td>{entry.regularHours ?? 0}</td>
                    <td>{entry.overtimeHours ?? 0}</td>
                    <td>
                      <Badge bg={statusVariant[entry.status] || 'secondary'}>{entry.status}</Badge>
                    </td>
                    <td>{entry.source || '—'}</td>
                    <td>{entry.notes || '—'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {entry.status !== 'APPROVED' && (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => updateEntryStatus(entry.id, 'APPROVED')}
                          >
                            <i className="bi bi-check-circle"></i>
                          </Button>
                        )}
                        {entry.status !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => updateEntryStatus(entry.id, 'REJECTED')}
                          >
                            <i className="bi bi-x-circle"></i>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TimeEntryManager;
