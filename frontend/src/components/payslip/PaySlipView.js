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

  // Fetch payslip data - SINGLE SOURCE OF TRUTH: Get processed payroll from backend
  useEffect(() => {
    const fetchPaySlip = async () => {
      try {
        setLoading(true);
        console.log('Fetching processed payslip for employee ID:', id);
        
        // Try to get the latest processed payslip from backend first
        try {
          const payslipData = await paySlipService.getLatestPaySlipByEmployee(id);
          console.log('Latest payslip data received:', payslipData);
          
          // Transform backend payslip data for display
          const payroll = payslipData.payroll;
          const employee = payroll.employee;
          
          // Calculate basic salary breakdown for display (60% of gross is basic)
          const basicSalary = payroll.grossPay * 0.6;
          const hra = basicSalary * 0.5; // 50% of basic as HRA
          const conveyanceAllowance = 2000; // Fixed allowances
          const medicalAllowance = 3000;
          const specialAllowance = payroll.grossPay - basicSalary - hra - conveyanceAllowance - medicalAllowance;
          
          const transformedPaySlip = {
            id: payslipData.id,
            payslipNumber: payslipData.payslipNumber,
            issueDate: payslipData.issueDate,
            paymentDate: payslipData.paymentDate,
            employee: {
              id: employee.id,
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              address: employee.address || 'Mumbai, Maharashtra',
              city: employee.city || 'Mumbai',
              state: employee.state || 'Maharashtra',
              zipCode: employee.zipCode || '400001',
              employeeType: employee.discriminator || 'SALARIED',
              employeeId: `EMP${String(employee.id).padStart(3, '0')}`,
              pan: 'ABCDE1234F',
              uan: '101234567890'
            },
            payPeriodStart: payroll.payPeriodStart,
            payPeriodEnd: payroll.payPeriodEnd,
            basicSalary: Math.round(basicSalary),
            allowances: {
              hra: Math.round(hra),
              conveyance: conveyanceAllowance,
              medical: medicalAllowance,
              special: Math.round(specialAllowance)
            },
            grossPay: Math.round(payroll.grossPay),
            deductions: {
              incomeTax: Math.round(payroll.incomeTax || 0),
              providentFund: Math.round(payroll.providentFund || 0),
              esi: Math.round(payroll.esi || 0),
              professionalTax: Math.round(payroll.professionalTax || 0),
              totalDeductions: Math.round((payroll.incomeTax || 0) + (payroll.providentFund || 0) + 
                                       (payroll.esi || 0) + (payroll.professionalTax || 0) + 
                                       (payroll.healthInsurance || 0) + (payroll.retirementContribution || 0))
            },
            netPay: Math.round(payroll.netPay),
            paymentMethod: payroll.paymentMethod || 'Bank Transfer',
            bankAccountNumber: payslipData.bankAccountNumber || 'XXXX-XXXX-1234',
            companyInfo: {
              name: 'Payroll Management System Pvt Ltd',
              address: 'Andheri East, Mumbai',
              city: 'Mumbai',
              state: 'Maharashtra',
              zipCode: '400069',
              phone: '+91-9876543210',
              email: 'payroll@company.com',
              cin: 'U72900MH2020PTC123456',
              pan: 'AABCP1234C',
              logo: '/admin-avatar.jpg'
            }
          };
          
          console.log('Transformed payslip from backend data:', transformedPaySlip);
          setPaySlip(transformedPaySlip);
          
        } catch (payslipError) {
          console.warn('No processed payslip found, showing message:', payslipError);
          
          // If no payslip exists, show an appropriate message
          setError('No processed payslip found for this employee. Please process payroll first.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payslip:', err);
        setError('Failed to load payslip data');
        setLoading(false);
      }
    };

    if (id) {
      fetchPaySlip();
    } else {
      setError('No employee ID provided');
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
            <p className="mb-1"><strong>{paySlip.companyInfo.name}</strong></p>
            <p className="mb-1">{paySlip.companyInfo.address}</p>
            <p className="mb-1">{paySlip.companyInfo.city}, {paySlip.companyInfo.state} {paySlip.companyInfo.zipCode}</p>
            <p className="mb-1"><strong>Phone:</strong> {paySlip.companyInfo.phone}</p>
            <p className="mb-1"><strong>Email:</strong> {paySlip.companyInfo.email}</p>
            <p className="mb-1"><strong>CIN:</strong> {paySlip.companyInfo.cin}</p>
            <p className="mb-1"><strong>PAN:</strong> {paySlip.companyInfo.pan}</p>
          </Col>
          
          <Col md={6} className="payslip-section">
            <h5 className="mb-3">Employee Information</h5>
            <p className="mb-1"><strong>Name:</strong> {paySlip.employee.firstName} {paySlip.employee.lastName}</p>
            <p className="mb-1"><strong>Employee ID:</strong> {paySlip.employee.employeeId}</p>
            <p className="mb-1"><strong>Address:</strong> {paySlip.employee.address}</p>
            <p className="mb-1">{paySlip.employee.city}, {paySlip.employee.state} {paySlip.employee.zipCode}</p>
            <p className="mb-1"><strong>Email:</strong> {paySlip.employee.email}</p>
            <p className="mb-1"><strong>PAN:</strong> {paySlip.employee.pan}</p>
            <p className="mb-1"><strong>UAN:</strong> {paySlip.employee.uan}</p>
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
                <th style={{ width: '25%' }} className="text-end">Amount (₹)</th>
                <th style={{ width: '25%' }} className="text-end">YTD (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-success">
                <td className="fw-bold">Basic Salary</td>
                <td className="text-end fw-bold">₹{paySlip.basicSalary.toLocaleString('en-IN')}</td>
                <td className="text-end">₹{(paySlip.basicSalary * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>HRA (House Rent Allowance)</td>
                <td className="text-end">₹{paySlip.allowances.hra.toLocaleString('en-IN')}</td>
                <td className="text-end">₹{(paySlip.allowances.hra * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Conveyance Allowance</td>
                <td className="text-end">₹{paySlip.allowances.conveyance.toLocaleString('en-IN')}</td>
                <td className="text-end">₹{(paySlip.allowances.conveyance * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Medical Allowance</td>
                <td className="text-end">₹{paySlip.allowances.medical.toLocaleString('en-IN')}</td>
                <td className="text-end">₹{(paySlip.allowances.medical * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Special Allowance</td>
                <td className="text-end">₹{paySlip.allowances.special.toLocaleString('en-IN')}</td>
                <td className="text-end">₹{(paySlip.allowances.special * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr className="table-light">
                <td className="fw-bold">Gross Salary</td>
                <td className="text-end fw-bold">₹{paySlip.grossPay.toLocaleString('en-IN')}</td>
                <td className="text-end">₹{(paySlip.grossPay * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Income Tax (TDS)</td>
                <td className="text-end text-danger">-₹{paySlip.deductions.incomeTax.toLocaleString('en-IN')}</td>
                <td className="text-end text-danger">-₹{(paySlip.deductions.incomeTax * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Provident Fund (PF)</td>
                <td className="text-end text-danger">-₹{paySlip.deductions.providentFund.toLocaleString('en-IN')}</td>
                <td className="text-end text-danger">-₹{(paySlip.deductions.providentFund * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>ESI (Employee State Insurance)</td>
                <td className="text-end text-danger">-₹{paySlip.deductions.esi.toLocaleString('en-IN')}</td>
                <td className="text-end text-danger">-₹{(paySlip.deductions.esi * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Professional Tax</td>
                <td className="text-end text-danger">-₹{paySlip.deductions.professionalTax.toLocaleString('en-IN')}</td>
                <td className="text-end text-danger">-₹{(paySlip.deductions.professionalTax * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr className="table-secondary">
                <td className="fw-bold">Total Deductions</td>
                <td className="text-end fw-bold text-danger">-₹{paySlip.deductions.totalDeductions.toLocaleString('en-IN')}</td>
                <td className="text-end text-danger">-₹{(paySlip.deductions.totalDeductions * 6).toLocaleString('en-IN')}</td>
              </tr>
              <tr className="table-primary">
                <td className="fw-bold fs-5">Net Pay</td>
                <td className="text-end fw-bold fs-5 text-success">₹{paySlip.netPay.toLocaleString('en-IN')}</td>
                <td className="text-end text-success">₹{(paySlip.netPay * 6).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="text-center mb-4">
          <button
            className="btn btn-success btn-lg"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer me-2"></i>
            Print Pay Slip
          </button>
        </div>

        <div className="payslip-footer text-center text-muted">
          <hr />
          <p className="mb-1">
            <small>यह एक कंप्यूटर जनरेटेड दस्तावेज है और इसमें हस्ताक्षर की आवश्यकता नहीं है।</small>
          </p>
          <p className="mb-1">
            <small>This is a computer-generated document and does not require a signature.</small>
          </p>
          <p className="mb-1">
            <small>
              For any queries regarding this pay slip, please contact HR at hr@payroll-mumbai.com or call +91 98765 43210
            </small>
          </p>
          <p className="mb-1">
            <small>CIN: U72900MH2020PTC123456 | PAN: AABCP1234C | GSTIN: 27AABCP1234C1ZR</small>
          </p>
          <p className="mb-0">
            <small>© 2024 Payroll Management System Pvt Ltd. सभी अधिकार सुरक्षित।</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaySlipView;