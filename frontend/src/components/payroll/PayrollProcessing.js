import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { employeeService, payrollService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { toast } from 'react-toastify';

/**
 * PayrollProcessing component.
 * Allows administrators to process payrolls for employees.
 */
const PayrollProcessing = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [payPeriodStart, setPayPeriodStart] = useState('');
  const [payPeriodEnd, setPayPeriodEnd] = useState('');
  const [payrollResult, setPayrollResult] = useState(null);

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch this data from the backend
        // For now, we'll simulate it with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockEmployees = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            employeeType: 'SALARIED',
            annualSalary: 75000.00
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            employeeType: 'SALARIED',
            annualSalary: 85000.00
          },
          {
            id: 4,
            firstName: 'Robert',
            lastName: 'Williams',
            employeeType: 'HOURLY',
            hourlyRate: 25.00,
            hoursWorked: 160.0,
            overtimeHours: 10.0
          },
          {
            id: 5,
            firstName: 'Sarah',
            lastName: 'Brown',
            employeeType: 'HOURLY',
            hourlyRate: 22.50,
            hoursWorked: 155.0,
            overtimeHours: 5.0
          }
        ];
        
        setEmployees(mockEmployees);
        setLoading(false);
      } catch (err) {
        setError('Failed to load employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Set default pay period dates (current month)
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setPayPeriodStart(firstDay.toISOString().split('T')[0]);
    setPayPeriodEnd(lastDay.toISOString().split('T')[0]);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || !payPeriodStart || !payPeriodEnd) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setProcessing(true);
      setPayrollResult(null);
      
      // In a real implementation, you would call the API to process the payroll
      // For now, we'll simulate it with mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the selected employee
      const employee = employees.find(emp => emp.id === parseInt(selectedEmployee));
      
      // Calculate gross pay based on employee type
      let grossPay = 0;
      if (employee.employeeType === 'SALARIED') {
        // Monthly salary (annual salary divided by 12)
        grossPay = employee.annualSalary / 12;
      } else if (employee.employeeType === 'HOURLY') {
        // Regular pay + overtime pay
        const regularPay = employee.hourlyRate * employee.hoursWorked;
        const overtimePay = employee.hourlyRate * 1.5 * (employee.overtimeHours || 0);
        grossPay = regularPay + overtimePay;
      }
      
      // Calculate deductions
      const federalTax = grossPay * 0.20; // 20% federal tax
      const stateTax = grossPay * 0.06; // 6% state tax
      const socialSecurity = grossPay * 0.062; // 6.2% Social Security
      const medicare = grossPay * 0.0145; // 1.45% Medicare
      const healthInsurance = 150; // Flat health insurance premium
      const retirement = grossPay * 0.05; // 5% retirement contribution
      
      // Calculate net pay
      const totalDeductions = federalTax + stateTax + socialSecurity + medicare + healthInsurance + retirement;
      const netPay = grossPay - totalDeductions;
      
      // Create mock payroll result
      const mockPayrollResult = {
        id: Math.floor(Math.random() * 1000) + 1,
        employee: {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          employeeType: employee.employeeType
        },
        payPeriodStart: payPeriodStart,
        payPeriodEnd: payPeriodEnd,
        grossPay: grossPay,
        deductions: {
          federalTax: federalTax,
          stateTax: stateTax,
          socialSecurity: socialSecurity,
          medicare: medicare,
          healthInsurance: healthInsurance,
          retirement: retirement,
          totalDeductions: totalDeductions
        },
        netPay: netPay,
        processingDate: new Date().toISOString().split('T')[0]
      };
      
      setPayrollResult(mockPayrollResult);
      toast.success('Payroll processed successfully');
      setProcessing(false);
    } catch (err) {
      toast.error('Failed to process payroll');
      setProcessing(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setSelectedEmployee('');
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setPayPeriodStart(firstDay.toISOString().split('T')[0]);
    setPayPeriodEnd(lastDay.toISOString().split('T')[0]);
    setPayrollResult(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading payroll data..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="payroll-processing">
      <h2 className="mb-4">Payroll Processing</h2>
      
      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header>Process Payroll</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee</Form.Label>
                  <Form.Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} - {employee.employeeType === 'SALARIED' ? 'Salaried' : 'Hourly'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Pay Period Start</Form.Label>
                      <Form.Control
                        type="date"
                        value={payPeriodStart}
                        onChange={(e) => setPayPeriodStart(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Pay Period End</Form.Label>
                      <Form.Control
                        type="date"
                        value={payPeriodEnd}
                        onChange={(e) => setPayPeriodEnd(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={handleReset}
                    disabled={processing}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={processing || !selectedEmployee || !payPeriodStart || !payPeriodEnd}
                  >
                    {processing ? 'Processing...' : 'Process Payroll'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          {payrollResult && (
            <Card className="mb-4">
              <Card.Header>Payroll Result</Card.Header>
              <Card.Body>
                <Alert variant="success" className="mb-3">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Payroll processed successfully on {payrollResult.processingDate}
                </Alert>
                
                <div className="mb-3">
                  <strong>Employee:</strong> {payrollResult.employee.name}
                </div>
                
                <div className="mb-3">
                  <strong>Pay Period:</strong> {new Date(payrollResult.payPeriodStart).toLocaleDateString()} - {new Date(payrollResult.payPeriodEnd).toLocaleDateString()}
                </div>
                
                <Table bordered className="mb-3">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="table-light">
                      <td><strong>Gross Pay</strong></td>
                      <td className="text-end"><strong>${payrollResult.grossPay.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                      <td>Federal Tax</td>
                      <td className="text-end">${payrollResult.deductions.federalTax.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>State Tax</td>
                      <td className="text-end">${payrollResult.deductions.stateTax.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Social Security</td>
                      <td className="text-end">${payrollResult.deductions.socialSecurity.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Medicare</td>
                      <td className="text-end">${payrollResult.deductions.medicare.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Health Insurance</td>
                      <td className="text-end">${payrollResult.deductions.healthInsurance.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Retirement Contribution</td>
                      <td className="text-end">${payrollResult.deductions.retirement.toFixed(2)}</td>
                    </tr>
                    <tr className="table-secondary">
                      <td><strong>Total Deductions</strong></td>
                      <td className="text-end"><strong>${payrollResult.deductions.totalDeductions.toFixed(2)}</strong></td>
                    </tr>
                    <tr className="table-primary">
                      <td><strong>Net Pay</strong></td>
                      <td className="text-end"><strong>${payrollResult.netPay.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
                
                <div className="d-flex justify-content-end">
                  <Button variant="success">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Generate Pay Slip
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PayrollProcessing;