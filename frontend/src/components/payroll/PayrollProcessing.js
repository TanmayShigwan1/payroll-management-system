import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { employeeService, payrollService, paySlipService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { toast } from 'react-toastify';

/**
 * PayrollProcessing component.
 * Allows administrators to process payrolls for employees.
 */
const PayrollProcessing = () => {
  const navigate = useNavigate();
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
        
        // Fetch real employee data from backend
        const employeesData = await employeeService.getAllEmployees();
        
        // Transform the data to match our component's expected format
        const transformedEmployees = employeesData.map(emp => ({
          id: emp.id,
          firstName: emp.firstName,  // API returns firstName directly
          lastName: emp.lastName,    // API returns lastName directly
          employeeType: (emp.annualSalary && emp.annualSalary > 0) ? 'SALARIED' : 'HOURLY',
          annualSalary: emp.annualSalary,
          hourlyRate: emp.hourlyRate,
          hoursWorked: emp.hoursWorked || 160, // Default 160 hours if not set
          overtimeHours: emp.overtimeHours || 0
        }));
        
        console.log('Transformed employees:', transformedEmployees);
        setEmployees(transformedEmployees);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employees:', err);
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

  // Handle form submission - SINGLE SOURCE OF TRUTH: Backend calculates everything
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || !payPeriodStart || !payPeriodEnd) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setProcessing(true);
      setPayrollResult(null);
      
      // Call the backend API to process payroll - SINGLE SOURCE OF TRUTH
      const payrollData = {
        employeeId: parseInt(selectedEmployee),
        payPeriodStart: payPeriodStart,
        payPeriodEnd: payPeriodEnd
      };
      
      console.log('Processing payroll with data:', payrollData);
      
      // Backend processes and saves the payroll
      const response = await payrollService.processPayroll(payrollData);
      
      console.log('Payroll processing response:', response);
      
      if (response.success) {
        // Get the processed payroll data from backend
        const processedPayroll = response.payroll;
        const payslip = response.payslip;
        
        // Transform backend data for display
        const payrollResult = {
          id: processedPayroll.id,
          employee: {
            id: processedPayroll.employee.id,
            name: `${processedPayroll.employee.firstName} ${processedPayroll.employee.lastName}`,
            employeeType: processedPayroll.employee.discriminator || 'SALARIED'
          },
          payPeriodStart: processedPayroll.payPeriodStart,
          payPeriodEnd: processedPayroll.payPeriodEnd,
          grossPay: processedPayroll.grossPay,
          deductions: {
            incomeTax: processedPayroll.incomeTax,
            professionalTax: processedPayroll.professionalTax,
            providentFund: processedPayroll.providentFund,
            esi: processedPayroll.esi,
            healthInsurance: processedPayroll.healthInsurance,
            retirement: processedPayroll.retirementContribution,
            totalDeductions: processedPayroll.incomeTax + processedPayroll.providentFund + 
                           processedPayroll.esi + processedPayroll.professionalTax + 
                           processedPayroll.healthInsurance + processedPayroll.retirementContribution
          },
          netPay: processedPayroll.netPay,
          processingDate: processedPayroll.processingDate,
          payslipId: payslip ? payslip.id : null
        };
        
        // Add payslip reference to the result
        payrollResult.payroll = processedPayroll;
        payrollResult.payslip = payslip;
        
        setPayrollResult(payrollResult);
        toast.success(`Payroll processed successfully! PaySlip ${payslip.payslipNumber} generated.`, {
          autoClose: 5000,
          onClick: () => navigate('/payslips')
        });
      } else {
        toast.error(response.message || 'Failed to process payroll');
      }
      
      setProcessing(false);
    } catch (err) {
      console.error('Payroll processing error:', err);
      toast.error(err.response?.data?.message || 'Failed to process payroll');
      setProcessing(false);
    }
  };

  // Handle Generate Pay Slip button click
  const handleGeneratePaySlip = async (payrollId) => {
    try {
      if (payrollResult && payrollResult.payslipId) {
        // Payslip already exists, navigate to view it
        navigate(`/payslips/${payrollResult.employee.id}`);
        return;
      }

      // Generate new payslip
      const payslip = await paySlipService.generatePaySlip(payrollId);
      
      // Update the payroll result to include payslip info
      setPayrollResult(prev => ({
        ...prev,
        payslip: payslip,
        payslipId: payslip.id
      }));
      
      toast.success('Pay slip generated successfully!');
      
      // Navigate to the payslip view
      navigate(`/payslips/${payrollResult.employee.id}`);
      
    } catch (error) {
      console.error('Error generating payslip:', error);
      toast.error('Failed to generate pay slip');
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
                      <td className="text-end"><strong>₹{payrollResult.grossPay.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                      <td>Income Tax</td>
                      <td className="text-end">₹{payrollResult.deductions.incomeTax.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Professional Tax</td>
                      <td className="text-end">₹{payrollResult.deductions.professionalTax.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Provident Fund (PF)</td>
                      <td className="text-end">₹{payrollResult.deductions.providentFund.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>ESI</td>
                      <td className="text-end">₹{payrollResult.deductions.esi.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Health Insurance</td>
                      <td className="text-end">₹{payrollResult.deductions.healthInsurance.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Retirement Contribution</td>
                      <td className="text-end">₹{payrollResult.deductions.retirement.toFixed(2)}</td>
                    </tr>
                    <tr className="table-secondary">
                      <td><strong>Total Deductions</strong></td>
                      <td className="text-end"><strong>₹{payrollResult.deductions.totalDeductions.toFixed(2)}</strong></td>
                    </tr>
                    <tr className="table-primary">
                      <td><strong>Net Pay</strong></td>
                      <td className="text-end"><strong>₹{payrollResult.netPay.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
                
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="outline-primary"
                    onClick={() => navigate('/payslips')}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    View All PaySlips
                  </Button>
                  <Button 
                    variant="success"
                    onClick={() => handleGeneratePaySlip(payrollResult.payroll.id)}
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>
                    View This PaySlip
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