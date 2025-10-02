import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Form, Badge } from 'react-bootstrap';
import { employeeService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

/**
 * Reports component.
 * Displays various payroll and employee reports.
 */
const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [reportType, setReportType] = useState('employee');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employeesData = await employeeService.getAllEmployees();
        setEmployees(employeesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load report data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading reports..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  const renderEmployeeReport = () => (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5>Employee Report</h5>
          <Button variant="primary" size="sm">
            <i className="bi bi-download me-2"></i>
            Export PDF
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Salary/Rate</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => {
              // Determine employee type based on actual salary data
              const isSalaried = employee.annualSalary && employee.annualSalary > 0;
              const isHourly = employee.hourlyRate && employee.hourlyRate > 0;
              
              return (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.firstName} {employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>
                    <Badge bg={isSalaried ? 'primary' : 'warning'}>
                      {isSalaried ? 'Salaried' : isHourly ? 'Hourly' : 'Unknown'}
                    </Badge>
                  </td>
                  <td>
                    {isSalaried 
                      ? `₹${employee.annualSalary.toLocaleString('en-IN')}/year`
                      : isHourly 
                      ? `₹${employee.hourlyRate.toLocaleString('en-IN')}/hour`
                      : 'N/A'
                    }
                  </td>
                  <td>{employee.city || 'Mumbai'}</td>
                  <td>
                    <Badge bg={
                      employee.status === 'Active' ? 'success' : 
                      employee.status === 'On Leave' ? 'warning' : 
                      employee.status === 'Terminated' ? 'danger' : 'success'
                    }>
                      {employee.status || 'Active'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  const renderPayrollSummary = () => {
    const salariedCount = employees.filter(emp => emp.annualSalary && emp.annualSalary > 0).length;
    const hourlyCount = employees.filter(emp => emp.hourlyRate && emp.hourlyRate > 0).length;
    const totalSalary = employees
      .filter(emp => emp.annualSalary && emp.annualSalary > 0)
      .reduce((sum, emp) => sum + (emp.annualSalary || 0), 0);

    return (
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Payroll Summary Report</h5>
            <Button variant="primary" size="sm">
              <i className="bi bi-download me-2"></i>
              Export PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-primary">{employees.length}</h4>
                  <p className="mb-0">Total Employees</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-success">{salariedCount}</h4>
                  <p className="mb-0">Salaried Employees</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-warning">{hourlyCount}</h4>
                  <p className="mb-0">Hourly Employees</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <h4 className="text-info">₹{(totalSalary / 12).toLocaleString()}</h4>
                  <p className="mb-0">Monthly Payroll</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <h6>Department Breakdown</h6>
          <Table striped>
            <thead>
              <tr>
                <th>City</th>
                <th>Employees</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {[...new Set(employees.map(emp => emp.city))].map(city => {
                const cityEmployees = employees.filter(emp => emp.city === city);
                const percentage = ((cityEmployees.length / employees.length) * 100).toFixed(1);
                return (
                  <tr key={city}>
                    <td>{city}</td>
                    <td>{cityEmployees.length}</td>
                    <td>{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="reports">
      <h2 className="mb-4">Reports</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Report Type</Form.Label>
            <Form.Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="employee">Employee Report</option>
              <option value="payroll">Payroll Summary</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      {reportType === 'employee' && renderEmployeeReport()}
      {reportType === 'payroll' && renderPayrollSummary()}
    </div>
  );
};

export default Reports;