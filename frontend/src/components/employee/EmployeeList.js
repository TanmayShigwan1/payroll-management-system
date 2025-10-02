import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { employeeService, departmentService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { toast } from 'react-toastify';

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
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState({ employeeId: null, newStatus: '', employeeName: '' });
  const [departments, setDepartments] = useState([]);

  // Function to fetch and format employee data
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch employees from the backend API
      const employeesData = await employeeService.getAllEmployees();
      
      // Debug log to see actual API response
      console.log('Raw employee data from API:', employeesData);
      
      // Map the API response to match frontend expectations
      const formattedEmployees = employeesData.map(emp => {
        console.log('Processing employee:', emp);
        return {
          id: emp.id,
          firstName: emp.firstName || 'Unknown',
          lastName: emp.lastName || 'Name', 
          email: emp.email,
          phoneNumber: emp.phoneNumber,
          hireDate: emp.hireDate,
          address: emp.address,
          city: emp.city,
          state: emp.state,
          zipCode: emp.zipCode,
          taxId: emp.taxId,
          // Include the status from backend (this was missing!)
          status: emp.status || 'Active',
          department: emp.department || null,
          // Derive employee type from salary vs hourly rate (using lowercase for consistency)
          employeeType: emp.annualSalary && emp.annualSalary > 0 ? 'salaried' : (emp.hourlyRate && emp.hourlyRate > 0 ? 'hourly' : 'unknown'),
          // Salaried employee fields
          annualSalary: emp.annualSalary,
          bonusPercentage: emp.bonusPercentage,
          // Hourly employee fields
          hourlyRate: emp.hourlyRate,
          hoursWorked: emp.hoursWorked,
          overtimeHours: emp.overtimeHours,
          overtimeRateMultiplier: emp.overtimeRateMultiplier
        };
      });
      
      setEmployees(formattedEmployees);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  // Fetch employees data on component mount
  useEffect(() => {
    fetchEmployees();

    const loadDepartments = async () => {
      try {
        const departmentData = await departmentService.getAllDepartments();
        setDepartments(departmentData);
      } catch (deptErr) {
        console.error('Failed to load departments', deptErr);
        toast.error('Failed to load departments');
      }
    };

    loadDepartments();
  }, []);

  // Filter employees based on search term, employee type, and status
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'salaried' && employee.employeeType === 'salaried') ||
      (filterType === 'hourly' && employee.employeeType === 'hourly');
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (employee.status || 'Active') === filterStatus;

    const matchesDepartment =
      filterDepartment === 'all' ||
      (employee.department && String(employee.department.id) === String(filterDepartment));
    
    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
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
      
      // Call the API to delete the employee
      await employeeService.deleteEmployee(employeeToDelete.id);
      
      // Update state by removing the deleted employee
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      
      toast.success(`Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} deleted successfully`);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast.error('Failed to delete employee');
      setShowDeleteModal(false);
    }
  };

  // Handle employee status change
  const handleStatusChange = async (employeeId, newStatus) => {
    const employee = employees.find(emp => emp.id === employeeId);
    
    // Show confirmation dialog for termination
    if (newStatus === 'Terminated') {
      setStatusChangeData({
        employeeId,
        newStatus,
        employeeName: `${employee.firstName} ${employee.lastName}`
      });
      setShowStatusChangeModal(true);
      return;
    }
    
    // For other status changes, update immediately
    await updateEmployeeStatus(employeeId, newStatus);
  };

  // Confirm status change (especially for termination)
  const confirmStatusChange = async () => {
    setShowStatusChangeModal(false);
    await updateEmployeeStatus(statusChangeData.employeeId, statusChangeData.newStatus);
  };

  // Actually update the employee status
  const updateEmployeeStatus = async (employeeId, newStatus) => {
    try {
      // Store the original status for potential rollback
      const originalEmployee = employees.find(emp => emp.id === employeeId);
      const originalStatus = originalEmployee?.status || 'Active';
      
      // Optimistically update the local state for immediate feedback
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );
      
      // Update status on the backend
      await employeeService.updateEmployeeStatus(employeeId, newStatus);
      
      // Re-fetch all employee data to ensure full synchronization with backend
      await fetchEmployees();
      
      toast.success(`Employee status updated to ${newStatus}`);
      
    } catch (error) {
      console.error('Failed to update employee status:', error);
      toast.error('Failed to update employee status');
      
      // Re-fetch data on error to ensure consistency
      await fetchEmployees();
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
            
            <Form.Select 
              className="ms-3" 
              style={{ width: 'auto' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </Form.Select>

            <Form.Select
              className="ms-3"
              style={{ width: 'auto' }}
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
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
                  <th>Department</th>
                  <th>Pay Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
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
                        <span className={`badge ${employee.employeeType === 'salaried' ? 'bg-info' : 'bg-warning'}`}>
                          {employee.employeeType === 'salaried' ? 'Salaried' : employee.employeeType === 'hourly' ? 'Hourly' : 'Unknown'}
                        </span>
                      </td>
                      <td>{employee.department?.name || 'Unassigned'}</td>
                      <td>
                        {employee.employeeType === 'salaried' && employee.annualSalary
                          ? `₹${employee.annualSalary.toLocaleString('en-IN')} / year` 
                          : employee.employeeType === 'hourly' && employee.hourlyRate
                          ? `₹${employee.hourlyRate.toLocaleString('en-IN')} / hour`
                          : 'N/A'}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className={`badge me-2 ${
                            (employee.status || 'Active') === 'Active' ? 'bg-success' :
                            employee.status === 'On Leave' ? 'bg-warning' :
                            employee.status === 'Terminated' ? 'bg-danger' : 'bg-success'
                          }`}>
                            {employee.status || 'Active'}
                          </span>
                          <Form.Select 
                            size="sm"
                            value={employee.status || 'Active'} 
                            onChange={(e) => handleStatusChange(employee.id, e.target.value)}
                            style={{ width: '120px' }}
                          >
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Terminated">Terminated</option>
                          </Form.Select>
                        </div>
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

      {/* Status Change Confirmation Modal */}
      <Modal show={showStatusChangeModal} onHide={() => setShowStatusChangeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {statusChangeData.employeeName && (
            <div>
              <p>
                Are you sure you want to change the status of <strong>{statusChangeData.employeeName}</strong> to <strong>{statusChangeData.newStatus}</strong>?
              </p>
              {statusChangeData.newStatus === 'Terminated' && (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Warning:</strong> Terminating an employee will affect their access to payroll and benefits. This action should be carefully reviewed.
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusChangeModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={statusChangeData.newStatus === 'Terminated' ? 'danger' : 'primary'} 
            onClick={confirmStatusChange}
          >
            Confirm Change
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;