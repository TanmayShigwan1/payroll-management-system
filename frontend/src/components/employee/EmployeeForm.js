import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { Formik } from 'formik';
import * as Yup from 'yup';

/**
 * EmployeeForm component.
 * Handles both creating new employees and editing existing ones.
 * Form fields dynamically change based on employee type (salaried or hourly).
 */
const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [employeeType, setEmployeeType] = useState('SALARIED');
  
  // Initial form values
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    hireDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    taxId: '',
    employeeType: 'SALARIED',
    // Salaried employee fields
    annualSalary: '',
    bonusPercentage: '',
    // Hourly employee fields
    hourlyRate: '',
    hoursWorked: '',
    overtimeHours: '',
    overtimeRateMultiplier: '1.5'
  };
  
  // Form validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    hireDate: Yup.date().required('Hire date is required').max(new Date(), 'Hire date cannot be in the future'),
    taxId: Yup.string().required('Tax ID is required'),
    employeeType: Yup.string().required('Employee type is required'),
    
    // Conditional validation based on employee type
    annualSalary: Yup.number()
      .when('employeeType', {
        is: 'SALARIED',
        then: Yup.number()
          .required('Annual salary is required')
          .positive('Annual salary must be positive')
      }),
      
    bonusPercentage: Yup.number()
      .when('employeeType', {
        is: 'SALARIED',
        then: Yup.number()
          .min(0, 'Bonus percentage cannot be negative')
          .max(100, 'Bonus percentage cannot exceed 100%')
      }),
      
    hourlyRate: Yup.number()
      .when('employeeType', {
        is: 'HOURLY',
        then: Yup.number()
          .required('Hourly rate is required')
          .positive('Hourly rate must be positive')
      }),
      
    hoursWorked: Yup.number()
      .when('employeeType', {
        is: 'HOURLY',
        then: Yup.number()
          .required('Hours worked is required')
          .positive('Hours worked must be positive')
      }),
      
    overtimeHours: Yup.number()
      .when('employeeType', {
        is: 'HOURLY',
        then: Yup.number()
          .min(0, 'Overtime hours cannot be negative')
      }),
      
    overtimeRateMultiplier: Yup.number()
      .when('employeeType', {
        is: 'HOURLY',
        then: Yup.number()
          .min(1, 'Overtime rate multiplier must be at least 1')
      })
  });
  
  // Fetch employee data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          setLoading(true);
          
          // In a real implementation, you would fetch this data from the backend
          // For now, we'll simulate it with mock data
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock data for demonstration
          let mockEmployee;
          
          if (id === '1') {
            mockEmployee = {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phoneNumber: '555-123-4567',
              hireDate: '2020-01-15',
              address: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              taxId: 'TX-1001',
              employeeType: 'SALARIED',
              annualSalary: 75000.00,
              bonusPercentage: 5.0
            };
          } else if (id === '4') {
            mockEmployee = {
              id: 4,
              firstName: 'Robert',
              lastName: 'Williams',
              email: 'robert.williams@example.com',
              phoneNumber: '555-456-7890',
              hireDate: '2020-09-05',
              address: '101 Elm St',
              city: 'Houston',
              state: 'TX',
              zipCode: '77001',
              taxId: 'TX-2001',
              employeeType: 'HOURLY',
              hourlyRate: 25.00,
              hoursWorked: 160.0,
              overtimeHours: 10.0,
              overtimeRateMultiplier: 1.5
            };
          } else {
            throw new Error('Employee not found');
          }
          
          // Update form initial values with employee data
          setEmployeeType(mockEmployee.employeeType);
          
          setLoading(false);
          return mockEmployee;
        } catch (err) {
          setError('Failed to load employee data');
          setLoading(false);
          return initialValues;
        }
      };
      
      fetchEmployee();
    }
  }, [id, isEditMode]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // In a real implementation, you would call the API to save the employee
      // For now, we'll just simulate it
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        isEditMode 
          ? `Employee ${values.firstName} ${values.lastName} updated successfully` 
          : `Employee ${values.firstName} ${values.lastName} created successfully`
      );
      
      navigate('/employees');
    } catch (err) {
      toast.error(
        isEditMode 
          ? 'Failed to update employee' 
          : 'Failed to create employee'
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message={`Loading employee data...`} />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="employee-form">
      <h2 className="mb-4">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
      
      <Card className="form-card">
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue
            }) => (
              <Form onSubmit={handleSubmit}>
                {/* Employee Type Selection */}
                <div className="form-section">
                  <h3 className="form-section-title">Employee Type</h3>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee Type</Form.Label>
                    <Form.Select
                      name="employeeType"
                      value={values.employeeType}
                      onChange={(e) => {
                        setEmployeeType(e.target.value);
                        setFieldValue('employeeType', e.target.value);
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.employeeType && !!errors.employeeType}
                    >
                      <option value="SALARIED">Salaried Employee</option>
                      <option value="HOURLY">Hourly Employee</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.employeeType}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Select the type of employee to determine pay calculation method.
                    </Form.Text>
                  </Form.Group>
                </div>
                
                {/* Personal Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Personal Information</h3>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.firstName && !!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.lastName && !!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && !!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          value={values.phoneNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hire Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="hireDate"
                          value={values.hireDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.hireDate && !!errors.hireDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.hireDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tax ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="taxId"
                          value={values.taxId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.taxId && !!errors.taxId}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.taxId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                
                {/* Address Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Address Information</h3>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={values.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>ZIP Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={values.zipCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                
                {/* Compensation Information - Salaried */}
                {values.employeeType === 'SALARIED' && (
                  <div className="form-section">
                    <h3 className="form-section-title">Compensation Information</h3>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Annual Salary ($)</Form.Label>
                          <Form.Control
                            type="number"
                            name="annualSalary"
                            value={values.annualSalary}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.annualSalary && !!errors.annualSalary}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.annualSalary}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Bonus Percentage (%)</Form.Label>
                          <Form.Control
                            type="number"
                            name="bonusPercentage"
                            value={values.bonusPercentage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.bonusPercentage && !!errors.bonusPercentage}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bonusPercentage}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                
                {/* Compensation Information - Hourly */}
                {values.employeeType === 'HOURLY' && (
                  <div className="form-section">
                    <h3 className="form-section-title">Compensation Information</h3>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Hourly Rate ($)</Form.Label>
                          <Form.Control
                            type="number"
                            name="hourlyRate"
                            value={values.hourlyRate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.hourlyRate && !!errors.hourlyRate}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.hourlyRate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Hours Worked</Form.Label>
                          <Form.Control
                            type="number"
                            name="hoursWorked"
                            value={values.hoursWorked}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.hoursWorked && !!errors.hoursWorked}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.hoursWorked}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Overtime Hours</Form.Label>
                          <Form.Control
                            type="number"
                            name="overtimeHours"
                            value={values.overtimeHours}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.overtimeHours && !!errors.overtimeHours}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.overtimeHours}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Overtime Rate Multiplier</Form.Label>
                          <Form.Control
                            type="number"
                            name="overtimeRateMultiplier"
                            value={values.overtimeRateMultiplier}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.overtimeRateMultiplier && !!errors.overtimeRateMultiplier}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.overtimeRateMultiplier}
                          </Form.Control.Feedback>
                          <Form.Text className="text-muted">
                            Standard overtime is typically 1.5 times the regular hourly rate.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                
                {/* Form Actions */}
                <div className="form-actions">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/employees')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Create Employee')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmployeeForm;