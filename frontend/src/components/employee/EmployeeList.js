import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { employeeService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { toast } from 'react-toastify';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import { convertUSDtoINR, formatCurrency } from '../../utils/currencyUtils';

/**
 * EmployeeList component.
 * Displays a table of employees with search and filtering options.
 * Allows for adding, editing, and deleting employees.
 */
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  // Get currency from context
  const { currency } = useContext(CurrencyContext);

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
            email: 'john.doe@example.com',
            phoneNumber: '555-123-4567',
            hireDate: '2020-01-15',
            employeeType: 'SALARIED',
            annualSalary: 75000.00,
            bonusPercentage: 5.0
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phoneNumber: '555-234-5678',
            hireDate: '2019-06-20',
            employeeType: 'SALARIED',
            annualSalary: 85000.00,
            bonusPercentage: 7.5
          },
          {
            id: 3,
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.johnson@example.com',
            phoneNumber: '555-345-6789',
            hireDate: '2021-03-10',
            employeeType: 'SALARIED',
            annualSalary: 65000.00,
            bonusPercentage: 4.0
          },
          {
            id: 4,
            firstName: 'Robert',
            lastName: 'Williams',
            email: 'robert.williams@example.com',
            phoneNumber: '555-456-7890',
            hireDate: '2020-09-05',
            employeeType: 'HOURLY',
            hourlyRate: 25.00,
            hoursWorked: 160.0,
            overtimeHours: 10.0
          },
          {
            id: 5,
            firstName: 'Sarah',
            lastName: 'Brown',
            email: 'sarah.brown@example.com',
            phoneNumber: '555-567-8901',
            hireDate: '2021-05-18',
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

  // Filter employees based on search term and employee type
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'salaried' && employee.employeeType === 'SALARIED') ||
      (filterType === 'hourly' && employee.employeeType === 'HOURLY');
    
    return matchesSearch && matchesType;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter type change
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  // Open delete confirmation modal
  const confirmDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  // Handle employee deletion
  const handleDelete = async () => {
    try {
      setShowDeleteModal(false);
      
      if (!employeeToDelete) return;
      
      // In a real implementation, you would call the API to delete the employee
      // For now, we'll just simulate it
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state by removing the deleted employee
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      
      toast.success(`Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} deleted successfully`);
      setEmployeeToDelete(null);
    } catch (err) {
      toast.error('Failed to delete employee');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading employees..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="employee-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employees</h2>
        <Button as={Link} to="/employees/new" variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Employee
        </Button>
      </div>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="employee-search">
              <InputGroup>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>
            
            <Form.Select 
              className="ms-3" 
              style={{ width: 'auto' }}
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="all">All Employees</option>
              <option value="salaried">Salaried Employees</option>
              <option value="hourly">Hourly Employees</option>
            </Form.Select>
          </div>
          
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Hire Date</th>
                  <th>Type</th>
                  <th>Pay Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No employees found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{`${employee.firstName} ${employee.lastName}`}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phoneNumber}</td>
                      <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${employee.employeeType === 'SALARIED' ? 'bg-info' : 'bg-warning'}`}>
                          {employee.employeeType === 'SALARIED' ? 'Salaried' : 'Hourly'}
                        </span>
                      </td>
                      <td>
                        {employee.employeeType === 'SALARIED' 
                          ? `${formatCurrency(
                              currency === 'USD' 
                                ? employee.annualSalary 
                                : convertUSDtoINR(employee.annualSalary),
                              currency
                            )} / year` 
                          : `${formatCurrency(
                              currency === 'USD' 
                                ? employee.hourlyRate 
                                : convertUSDtoINR(employee.hourlyRate),
                              currency
                            )} / hour`}
                      </td>
                      <td>
                        <Button 
                          as={Link} 
                          to={`/employees/edit/${employee.id}`} 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => confirmDelete(employee)}
                        >
                          <i className="bi bi-trash"></i>
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
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employeeToDelete && (
            <p>
              Are you sure you want to delete employee {employeeToDelete.firstName} {employeeToDelete.lastName}? 
              This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;