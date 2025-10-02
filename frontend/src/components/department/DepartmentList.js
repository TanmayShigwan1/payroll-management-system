import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Table, Form, Row, Col, Modal, Badge } from 'react-bootstrap';
import { departmentService, employeeService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { toast } from 'react-toastify';

const buildDefaultRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toISODate = (d) => d.toISOString().split('T')[0];
  return {
    start: toISODate(first),
    end: toISODate(last)
  };
};

const DepartmentList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    costCenter: '',
    description: ''
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [summaryRange, setSummaryRange] = useState(buildDefaultRange());
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptData, employeeData] = await Promise.all([
        departmentService.getAllDepartments(),
        employeeService.getAllEmployees()
      ]);
      setDepartments(deptData);
      setEmployees(employeeData);
      setError(null);
    } catch (err) {
      console.error('Failed to load department data', err);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const departmentStats = useMemo(() => {
    const result = new Map();
    employees.forEach((employee) => {
      const deptId = employee.department?.id;
      if (!deptId) {
        return;
      }
      if (!result.has(deptId)) {
        result.set(deptId, { count: 0, salaried: 0, hourly: 0 });
      }
      const entry = result.get(deptId);
      entry.count += 1;
      if (employee.annualSalary && employee.annualSalary > 0) {
        entry.salaried += 1;
      } else if (employee.hourlyRate && employee.hourlyRate > 0) {
        entry.hourly += 1;
      }
    });
    return result;
  }, [employees]);

  const handleCreateDepartment = async (event) => {
    event.preventDefault();
    if (!newDepartment.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    try {
      const created = await departmentService.createDepartment(newDepartment);
      setDepartments((prev) => [...prev, created]);
      toast.success(`Department ${created.name} created`);
      setShowCreateModal(false);
      setNewDepartment({ name: '', costCenter: '', description: '' });
    } catch (err) {
      console.error('Failed to create department', err);
      toast.error('Failed to create department');
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    const target = departments.find((dept) => dept.id === departmentId);
    if (!target) {
      return;
    }
    const confirmed = window.confirm(`Delete department ${target.name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      await departmentService.deleteDepartment(departmentId);
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
      toast.success(`Department ${target.name} deleted`);
    } catch (err) {
      console.error('Failed to delete department', err);
      toast.error('Failed to delete department');
    }
  };

  const openSummaryModal = (department) => {
    setSelectedDepartment(department);
    setSummaryData(null);
    setSummaryRange(buildDefaultRange());
    setShowSummaryModal(true);
  };

  const fetchSummary = async () => {
    if (!selectedDepartment) {
      return;
    }

    try {
      setSummaryLoading(true);
      const summary = await departmentService.getPayrollSummary(
        selectedDepartment.id,
        summaryRange.start,
        summaryRange.end
      );
      setSummaryData(summary);
    } catch (err) {
      console.error('Failed to load department summary', err);
      toast.error('Failed to load department summary');
      setSummaryData(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (showSummaryModal && selectedDepartment) {
      fetchSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSummaryModal, selectedDepartment]);

  if (loading) {
    return <LoadingSpinner message="Loading departments..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="department-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Departments</h2>
        <Button onClick={() => setShowCreateModal(true)} variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add Department
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header>Department Overview</Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cost Center</th>
                <th>Description</th>
                <th>Employees</th>
                <th>Salaried</th>
                <th>Hourly</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No departments found.
                  </td>
                </tr>
              ) : (
                departments.map((department) => {
                  const stats = departmentStats.get(department.id) || {
                    count: 0,
                    salaried: 0,
                    hourly: 0
                  };
                  return (
                    <tr key={department.id}>
                      <td>{department.name}</td>
                      <td>{department.costCenter || '—'}</td>
                      <td>{department.description || '—'}</td>
                      <td><Badge bg="secondary">{stats.count}</Badge></td>
                      <td>{stats.salaried}</td>
                      <td>{stats.hourly}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openSummaryModal(department)}
                          >
                            <i className="bi bi-graph-up"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteDepartment(department.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Form onSubmit={handleCreateDepartment}>
          <Modal.Header closeButton>
            <Modal.Title>Create Department</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost Center</Form.Label>
              <Form.Control
                type="text"
                value={newDepartment.costCenter}
                onChange={(e) => setNewDepartment((prev) => ({ ...prev, costCenter: e.target.value }))}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newDepartment.description}
                onChange={(e) => setNewDepartment((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size="lg" show={showSummaryModal} onHide={() => setShowSummaryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDepartment ? `${selectedDepartment.name} Payroll Summary` : 'Payroll Summary'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDepartment && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={summaryRange.start}
                      onChange={(e) => setSummaryRange((prev) => ({ ...prev, start: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={summaryRange.end}
                      onChange={(e) => setSummaryRange((prev) => ({ ...prev, end: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={fetchSummary} disabled={summaryLoading}>
                  {summaryLoading ? 'Loading...' : 'Refresh Summary'}
                </Button>
              </div>
            </>
          )}

          {summaryLoading && <LoadingSpinner message="Loading summary..." compact />}

          {!summaryLoading && summaryData && (
            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5>Total Gross Pay</h5>
                    <p className="display-6">₹{summaryData.totalGrossPay?.toLocaleString('en-IN') || '0'}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5>Total Net Pay</h5>
                    <p className="display-6">₹{summaryData.totalNetPay?.toLocaleString('en-IN') || '0'}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <h6>Regular Hours</h6>
                    <p className="h4">{summaryData.totalRegularHours ?? 0}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <h6>Overtime Hours</h6>
                    <p className="h4">{summaryData.totalOvertimeHours ?? 0}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {!summaryLoading && !summaryData && (
            <p className="text-muted">No summary data available for the selected range.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentList;
