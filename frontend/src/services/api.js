import axios from 'axios';
import config from '../config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Employee API services
const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await apiClient.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  
  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create new employee
  createEmployee: async (employeeData) => {
    try {
      // Determine endpoint based on employee type
      const endpoint = employeeData.employeeType === 'hourly' 
        ? '/employees/hourly' 
        : '/employees/salaried';
      
      const response = await apiClient.post(endpoint, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },
  
  // Update existing employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiClient.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete employee
  deleteEmployee: async (id) => {
    try {
      await apiClient.delete(`/employees/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  }
};

// Payroll API services
const payrollService = {
  // Process payroll for an employee
  processPayroll: async (payrollData) => {
    try {
      const response = await apiClient.post('/payroll/calculate', payrollData);
      return response.data;
    } catch (error) {
      console.error('Error processing payroll:', error);
      throw error;
    }
  },
  
  // Get payroll history for an employee
  getPayrollHistory: async (employeeId) => {
    try {
      const response = await apiClient.get(`/payroll/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll history for employee ${employeeId}:`, error);
      throw error;
    }
  },
  
  // Get all payrolls for a specific period
  getPayrollsByPeriod: async (startDate, endDate) => {
    try {
      const response = await apiClient.get('/payroll', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payrolls by period:', error);
      throw error;
    }
  }
};

// PaySlip API services
const paySlipService = {
  // Generate pay slip for a processed payroll
  generatePaySlip: async (payrollId) => {
    try {
      const response = await apiClient.post(`/payslips/generate/${payrollId}`);
      return response.data;
    } catch (error) {
      console.error(`Error generating pay slip for payroll ${payrollId}:`, error);
      throw error;
    }
  },
  
  // Get pay slip by ID
  getPaySlipById: async (id) => {
    try {
      const response = await apiClient.get(`/payslips/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pay slip with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get all pay slips
  getAllPaySlips: async () => {
    try {
      const response = await apiClient.get('/payslips');
      return response.data;
    } catch (error) {
      console.error('Error fetching all pay slips:', error);
      throw error;
    }
  },
  
  // Get pay slips for an employee
  getPaySlipsByEmployee: async (employeeId) => {
    try {
      const response = await apiClient.get(`/payslips/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pay slips for employee ${employeeId}:`, error);
      throw error;
    }
  }
};

// Export all services
export { employeeService, payrollService, paySlipService };

// Default export for backward compatibility
export default {
  employee: employeeService,
  payroll: payrollService,
  paySlip: paySlipService
};