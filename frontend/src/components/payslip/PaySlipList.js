import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { employeeService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

/**
 * PaySlipList component.
 * Displays a table of payslips with filtering options.
 */
const PaySlipList = () => {
  const [paySlips, setPaySlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [employees, setEmployees] = useState([]);

  // Fetch payslips data - SINGLE SOURCE OF TRUTH: Get processed payslips from backend
  const fetchPaySlips = async () => {
    try {
      setLoading(true);
      
      // Fetch employees for filter dropdown
      const employeesData = await employeeService.getAllEmployees();
      const transformedEmployees = employeesData.map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`
      }));
      setEmployees(transformedEmployees);
      
      // Try to fetch actual processed payslips from backend
      try {
        // Import paySlipService to get real payslips
        const { paySlipService } = await import('../../services/api');
        const paySlipsData = await paySlipService.getAllPaySlips();
        
        console.log('Processed payslips from backend:', paySlipsData);
        
        // Transform backend payslips for display
        const transformedPaySlips = paySlipsData.map(payslip => ({
          id: payslip.id,
          payslipNumber: payslip.payslipNumber,
          employee: {
            id: payslip.payroll.employee.id,
            name: `${payslip.payroll.employee.firstName} ${payslip.payroll.employee.lastName}`
          },
          issueDate: payslip.issueDate,
          payPeriodStart: payslip.payroll.payPeriodStart,
          payPeriodEnd: payslip.payroll.payPeriodEnd,
          grossPay: Math.round(payslip.payroll.grossPay),
          netPay: Math.round(payslip.payroll.netPay),
          status: payslip.status || 'Generated'
        }));
        
        setPaySlips(transformedPaySlips);
        
      } catch (payslipError) {
        console.warn('No processed payslips found or API error:', payslipError);
        // If no processed payslips exist, show empty state
        setPaySlips([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching payslips:', err);
      setError('Failed to load payslips');
      setLoading(false);
    }
  };

  // Initial load and auto-refresh every 30 seconds for real-time sync
  useEffect(() => {
    fetchPaySlips();
    
    // Set up auto-refresh interval
    const refreshInterval = setInterval(fetchPaySlips, 30000); // 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Filter payslips based on search term and filters
  const filteredPaySlips = paySlips.filter(paySlip => {
    // Search term filter (payslip number or employee name)
    const matchesSearch = 
      paySlip.payslipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paySlip.employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Employee filter
    const matchesEmployee = 
      filterEmployee === '' || 
      paySlip.employee.id === parseInt(filterEmployee);
    
    // Date range filter
    let matchesDateRange = true;
    if (filterStartDate) {
      matchesDateRange = matchesDateRange && new Date(paySlip.payPeriodStart) >= new Date(filterStartDate);
    }
    if (filterEndDate) {
      matchesDateRange = matchesDateRange && new Date(paySlip.payPeriodEnd) <= new Date(filterEndDate);
    }
    
    return matchesSearch && matchesEmployee && matchesDateRange;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterEmployee('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchPaySlips();
  };

  // Handle Excel export
  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      const { paySlipService } = await import('../../services/api');
      const excelBlob = await paySlipService.exportAllPaySlipsToExcel();
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([excelBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslips_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Excel export successful!');
    } catch (error) {
      console.error('❌ Excel export failed:', error);
      setError('Failed to export Excel file');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading payslips..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="payslip-list">
      <h2 className="mb-4">Pay Slips</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="mb-4">
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                    <Form.Control
                      placeholder="Search by payslip number or employee..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee</Form.Label>
                  <Form.Select
                    value={filterEmployee}
                    onChange={(e) => setFilterEmployee(e.target.value)}
                  >
                    <option value="">All Employees</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={1} className="d-flex align-items-end mb-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleResetFilters}
                  className="w-100 me-2"
                >
                  Reset
                </Button>
              </Col>
              
              <Col md={1} className="d-flex align-items-end mb-3">
                <Button 
                  variant="primary" 
                  onClick={handleRefresh}
                  className="w-100 me-2"
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </Col>
              
              <Col md={1} className="d-flex align-items-end mb-3">
                <Button 
                  variant="success" 
                  onClick={handleExportToExcel}
                  className="w-100"
                  disabled={loading}
                >
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  Excel
                </Button>
              </Col>
            </Row>
          </div>
          
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>PaySlip #</th>
                  <th>Employee</th>
                  <th>Issue Date</th>
                  <th>Pay Period</th>
                  <th>Gross Pay</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaySlips.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {paySlips.length === 0 
                        ? "No processed payslips found. Please process payroll first using the Payroll Processing page." 
                        : "No payslips found matching your search criteria"}
                    </td>
                  </tr>
                ) : (
                  filteredPaySlips.map(paySlip => (
                    <tr key={paySlip.id}>
                      <td>{paySlip.payslipNumber}</td>
                      <td>{paySlip.employee.name}</td>
                      <td>{formatDate(paySlip.issueDate)}</td>
                      <td>{formatDate(paySlip.payPeriodStart)} - {formatDate(paySlip.payPeriodEnd)}</td>
                      <td>₹{paySlip.grossPay.toLocaleString('en-IN')}</td>
                      <td>₹{paySlip.netPay.toLocaleString('en-IN')}</td>
                      <td>
                        <span className="badge bg-success">{paySlip.status}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            as={Link} 
                            to={`/payslips/${paySlip.employee.id}`} 
                            variant="outline-primary" 
                            size="sm"
                            title="View Details"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            title="Download PDF"
                            onClick={() => {
                              // In a real app, this would download the PDF
                              alert('PDF download functionality would be implemented here');
                            }}
                          >
                            <i className="bi bi-download me-1"></i>
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaySlipList;