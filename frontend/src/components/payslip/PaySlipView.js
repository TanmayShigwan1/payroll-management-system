import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { paySlipService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

/**
 * PaySlipView component.
 * Displays a formatted payslip for an employee.
 */
const PaySlipView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paySlip, setPaySlip] = useState(null);

  // Fetch payslip data
  useEffect(() => {
    const fetchPaySlip = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch this data from the backend
        // For now, we'll simulate it with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockPaySlip = {
          id: parseInt(id),
          payslipNumber: `PS-1-20259-${id}`,
          issueDate: '2025-09-16',
          paymentDate: '2025-09-18',
          employee: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            employeeType: 'SALARIED'
          },
          payPeriodStart: '2025-09-01',
          payPeriodEnd: '2025-09-15',
          grossPay: 3125.00,
          deductions: {
            federalTax: 625.00,
            stateTax: 187.50,
            socialSecurity: 193.75,
            medicare: 45.31,
            healthInsurance: 150.00,
            retirement: 187.50,
            otherDeductions: 0.00,
            totalDeductions: 1389.06
          },
          netPay: 1735.94,
          paymentMethod: 'Direct Deposit',
          bankAccountNumber: '****1234',
          companyInfo: {
            name: 'Acme Corporation',
            address: '789 Corporate Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            phone: '555-987-6543',
            email: 'payroll@acmecorp.com',
            logo: 'https://via.placeholder.com/200x50?text=Acme+Corp'
          }
        };
        
        setPaySlip(mockPaySlip);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payslip data');
        setLoading(false);
      }
    };

    if (id) {
      fetchPaySlip();
    } else {
      setError('No payslip ID provided');
      setLoading(false);
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Loading payslip data..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!paySlip) {
    return <ErrorAlert message="Payslip not found" />;
  }

  return (
    <div className="payslip-view">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pay Slip</h2>
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <i className="bi bi-printer me-2"></i>
            Print
          </Button>
        </div>
      </div>
      
      <div className="payslip-container">
        <div className="payslip-header">
          <img src={paySlip.companyInfo.logo} alt="Company Logo" className="payslip-logo mb-3" />
          <h3 className="payslip-title">Employee Pay Slip</h3>
          <p className="text-muted">Pay Slip Number: {paySlip.payslipNumber}</p>
          <p className="text-muted">Issue Date: {formatDate(paySlip.issueDate)}</p>
        </div>
        
        <Row className="mb-4">
          <Col md={6} className="payslip-section">
            <h5 className="mb-3">Company Information</h5>
            <p className="mb-1">{paySlip.companyInfo.name}</p>
            <p className="mb-1">{paySlip.companyInfo.address}</p>
            <p className="mb-1">{paySlip.companyInfo.city}, {paySlip.companyInfo.state} {paySlip.companyInfo.zipCode}</p>
            <p className="mb-1">Phone: {paySlip.companyInfo.phone}</p>
            <p className="mb-1">Email: {paySlip.companyInfo.email}</p>
          </Col>
          
          <Col md={6} className="payslip-section">
            <h5 className="mb-3">Employee Information</h5>
            <p className="mb-1">{paySlip.employee.firstName} {paySlip.employee.lastName}</p>
            <p className="mb-1">{paySlip.employee.address}</p>
            <p className="mb-1">{paySlip.employee.city}, {paySlip.employee.state} {paySlip.employee.zipCode}</p>
            <p className="mb-1">Email: {paySlip.employee.email}</p>
            <p className="mb-1">Employee Type: {paySlip.employee.employeeType === 'SALARIED' ? 'Salaried' : 'Hourly'}</p>
          </Col>
        </Row>
        
        <div className="payslip-section mb-4">
          <h5 className="mb-3">Pay Period Information</h5>
          <Row>
            <Col md={4}>
              <div className="mb-2">
                <span className="fw-bold">Pay Period:</span>
                <div>{formatDate(paySlip.payPeriodStart)} - {formatDate(paySlip.payPeriodEnd)}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-2">
                <span className="fw-bold">Payment Date:</span>
                <div>{formatDate(paySlip.paymentDate)}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-2">
                <span className="fw-bold">Payment Method:</span>
                <div>{paySlip.paymentMethod}</div>
              </div>
            </Col>
          </Row>
          {paySlip.bankAccountNumber && (
            <div className="mt-2">
              <span className="fw-bold">Bank Account:</span> {paySlip.bankAccountNumber}
            </div>
          )}
        </div>
        
        <div className="payslip-section mb-4">
          <h5 className="mb-3">Earnings and Deductions</h5>
          <table className="payslip-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Description</th>
                <th style={{ width: '25%' }} className="text-end">Amount ($)</th>
                <th style={{ width: '25%' }} className="text-end">YTD ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-light">
                <td className="fw-bold">Gross Pay</td>
                <td className="text-end fw-bold">{paySlip.grossPay.toFixed(2)}</td>
                <td className="text-end">{(paySlip.grossPay * 18).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Federal Income Tax</td>
                <td className="text-end">-{paySlip.deductions.federalTax.toFixed(2)}</td>
                <td className="text-end">-{(paySlip.deductions.federalTax * 18).toFixed(2)}</td>
              </tr>
              <tr>
                <td>State Income Tax</td>
                <td className="text-end">-{paySlip.deductions.stateTax.toFixed(2)}</td>
                <td className="text-end">-{(paySlip.deductions.stateTax * 18).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Social Security</td>
                <td className="text-end">-{paySlip.deductions.socialSecurity.toFixed(2)}</td>
                <td className="text-end">-{(paySlip.deductions.socialSecurity * 18).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Medicare</td>
                <td className="text-end">-{paySlip.deductions.medicare.toFixed(2)}</td>
                <td className="text-end">-{(paySlip.deductions.medicare * 18).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Health Insurance</td>
                <td className="text-end">-{paySlip.deductions.healthInsurance.toFixed(2)}</td>
                <td className="text-end">-{(paySlip.deductions.healthInsurance * 18).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Retirement Contribution (401k)</td>
                <td className="text-end">-{paySlip.deductions.retirement.toFixed(2)}</td>
                <td className="text-end">-{(paySlip.deductions.retirement * 18).toFixed(2)}</td>
              </tr>
              {paySlip.deductions.otherDeductions > 0 && (
                <tr>
                  <td>Other Deductions</td>
                  <td className="text-end">-{paySlip.deductions.otherDeductions.toFixed(2)}</td>
                  <td className="text-end">-{(paySlip.deductions.otherDeductions * 18).toFixed(2)}</td>
                </tr>
              )}
              <tr className="table-secondary">
                <td className="fw-bold">Total Deductions</td>
                <td className="text-end fw-bold">-{paySlip.deductions.totalDeductions.toFixed(2)}</td>
                <td className="text-end">-{(paySlip.deductions.totalDeductions * 18).toFixed(2)}</td>
              </tr>
              <tr className="table-primary">
                <td className="fw-bold">Net Pay</td>
                <td className="text-end fw-bold">{paySlip.netPay.toFixed(2)}</td>
                <td className="text-end">{(paySlip.netPay * 18).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="payslip-footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>For any payroll inquiries, please contact the HR department at hr@acmecorp.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaySlipView;