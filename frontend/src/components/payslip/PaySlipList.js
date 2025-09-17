import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { paySlipService } from '../../services/api';
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

  // Fetch payslips data
  useEffect(() => {
    const fetchPaySlips = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch this data from the backend
        // For now, we'll simulate it with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockEmployees = [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
          { id: 4, name: 'Robert Williams' },
          { id: 5, name: 'Sarah Brown' }
        ];
        
        const mockPaySlips = [
          {
            id: 1,
            payslipNumber: 'PS-1-20259-1234',
            employee: {
              id: 1,
              name: 'John Doe'
            },
            issueDate: '2025-09-16',
            payPeriodStart: '2025-09-01',
            payPeriodEnd: '2025-09-15',
            grossPay: 3125.00,
            netPay: 1735.94,
            status: 'Processed'
          },
          {
            id: 2,
            payslipNumber: 'PS-2-20259-2345',
            employee: {
              id: 2,
              name: 'Jane Smith'
            },
            issueDate: '2025-09-16',
            payPeriodStart: '2025-09-01',
            payPeriodEnd: '2025-09-15',
            grossPay: 3541.67,
            netPay: 1912.41,
            status: 'Processed'
          },
          {
            id: 3,
            payslipNumber: 'PS-4-20259-3456',
            employee: {
              id: 4,
              name: 'Robert Williams'
            },
            issueDate: '2025-09-16',
            payPeriodStart: '2025-09-01',
            payPeriodEnd: '2025-09-15',
            grossPay: 4375.00,
            netPay: 2559.06,
            status: 'Processed'
          },
          {
            id: 4,
            payslipNumber: 'PS-5-20258-4567',
            employee: {
              id: 5,
              name: 'Sarah Brown'
            },
            issueDate: '2025-08-16',
            payPeriodStart: '2025-08-01',
            payPeriodEnd: '2025-08-15',
            grossPay: 3828.75,
            netPay: 2142.74,
            status: 'Processed'
          },
          {
            id: 5,
            payslipNumber: 'PS-1-20258-5678',
            employee: {
              id: 1,
              name: 'John Doe'
            },
            issueDate: '2025-08-16',
            payPeriodStart: '2025-08-01',
            payPeriodEnd: '2025-08-15',
            grossPay: 3125.00,
            netPay: 1735.94,
            status: 'Processed'
          }
        ];
        
        setEmployees(mockEmployees);
        setPaySlips(mockPaySlips);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payslips');
        setLoading(false);
      }
    };

    fetchPaySlips();
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
              <Col md={4}>
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
              
              <Col md={3}>
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
                  className="w-100"
                >
                  Reset
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
                      No payslips found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  filteredPaySlips.map(paySlip => (
                    <tr key={paySlip.id}>
                      <td>{paySlip.payslipNumber}</td>
                      <td>{paySlip.employee.name}</td>
                      <td>{formatDate(paySlip.issueDate)}</td>
                      <td>{formatDate(paySlip.payPeriodStart)} - {formatDate(paySlip.payPeriodEnd)}</td>
                      <td>${paySlip.grossPay.toFixed(2)}</td>
                      <td>${paySlip.netPay.toFixed(2)}</td>
                      <td>
                        <span className="badge bg-success">{paySlip.status}</span>
                      </td>
                      <td>
                        <Button 
                          as={Link} 
                          to={`/payslips/${paySlip.id}`} 
                          variant="outline-primary" 
                          size="sm"
                          className="me-2"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => window.open(`/payslips/${paySlip.id}`)}
                        >
                          <i className="bi bi-printer"></i>
                        </Button>
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