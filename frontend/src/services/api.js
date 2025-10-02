import axios from 'axios';
import config from '../config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to build query string parameters
const buildQueryParams = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

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
  
  // Create salaried employee specifically
  createSalariedEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post('/employees/salaried', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating salaried employee:', error);
      throw error;
    }
  },
  
  // Create hourly employee specifically
  createHourlyEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post('/employees/hourly', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating hourly employee:', error);
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
  },

  // Update employee status
  updateEmployeeStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/employees/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating employee status for ID ${id}:`, error);
      throw error;
    }
  },

  // Get employees filtered by department
  getEmployeesByDepartment: async (departmentId) => {
    try {
      const response = await apiClient.get(`/employees/department/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employees for department ${departmentId}:`, error);
      throw error;
    }
  },

  // Assign department to employee
  assignDepartment: async (employeeId, departmentId) => {
    try {
      const response = await apiClient.put(`/employees/${employeeId}/department`, { departmentId });
      return response.data;
    } catch (error) {
      console.error(`Error assigning department ${departmentId} to employee ${employeeId}:`, error);
      throw error;
    }
  }
};

// Payroll API services - Updated to use new backend endpoints
const payrollService = {
  // Process payroll for an employee - SINGLE SOURCE OF TRUTH
  processPayroll: async (payrollData) => {
    try {
      const response = await apiClient.post('/payroll/process', payrollData);
      return response.data;
    } catch (error) {
      console.error('Error processing payroll:', error);
      throw error;
    }
  },
  
  // Get payroll by ID
  getPayrollById: async (payrollId) => {
    try {
      const response = await apiClient.get(`/payroll/${payrollId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll with ID ${payrollId}:`, error);
      throw error;
    }
  },
  
  // Get payroll history for an employee
  getPayrollsByEmployee: async (employeeId) => {
    try {
      const response = await apiClient.get(`/payroll/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll history for employee ${employeeId}:`, error);
      throw error;
    }
  },
  
  // Test endpoint
  testPayrollController: async () => {
    try {
      const response = await apiClient.get('/payroll/test');
      return response.data;
    } catch (error) {
      console.error('Error testing payroll controller:', error);
      throw error;
    }
  }
};

// PaySlip API services - Updated to use new backend endpoints
const paySlipService = {
  // Generate pay slip for a processed payroll
  generatePaySlip: async (payrollId) => {
    try {
      const response = await apiClient.post(`/payroll/payslip/generate/${payrollId}`);
      return response.data;
    } catch (error) {
      console.error(`Error generating pay slip for payroll ${payrollId}:`, error);
      throw error;
    }
  },
  
  // Get pay slip by ID - now fetches from backend payroll records
  getPaySlipById: async (payslipId) => {
    try {
      const response = await apiClient.get(`/payroll/payslip/${payslipId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pay slip with ID ${payslipId}:`, error);
      throw error;
    }
  },
  
  // Get latest payslip for an employee - SINGLE SOURCE OF TRUTH
  getLatestPaySlipByEmployee: async (employeeId) => {
    try {
      const response = await apiClient.get(`/payroll/payslip/employee/${employeeId}/latest`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching latest payslip for employee ${employeeId}:`, error);
      throw error;
    }
  },
  
  // Get all pay slips for an employee
  getPaySlipsByEmployee: async (employeeId) => {
    try {
      const response = await apiClient.get(`/payroll/payslip/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pay slips for employee ${employeeId}:`, error);
      throw error;
    }
  },

  // Get all payslips in the system
  getAllPaySlips: async () => {
    try {
      const response = await apiClient.get('/payroll/payslips');
      return response.data;
    } catch (error) {
      console.error('Error fetching all payslips:', error);
      throw error;
    }
  },

  // Export all payslips to Excel
  exportAllPaySlipsToExcel: async () => {
    try {
      const response = await apiClient.get('/payroll/payslips/export/excel', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting payslips to Excel:', error);
      throw error;
    }
  },

  // Export specific employee payslips to Excel
  exportEmployeePaySlipsToExcel: async (employeeId) => {
    try {
      const response = await apiClient.get(`/payroll/payslips/employee/${employeeId}/export/excel`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting employee ${employeeId} payslips to Excel:`, error);
      throw error;
    }
  },

  // Backward compatibility - get payslip data for display
  getPaySlip: async (employeeId) => {
    try {
      // Try to get the latest payslip first
      const payslip = await this.getLatestPaySlipByEmployee(employeeId);
      return payslip;
    } catch (error) {
      // Fallback to employee data if no payslip exists
      console.warn(`No payslip found for employee ${employeeId}, falling back to employee data`);
      const employee = await employeeService.getEmployeeById(employeeId);
      return { employee };
    }
  }
};

// Department API services
const departmentService = {
  getAllDepartments: async () => {
    try {
      const response = await apiClient.get('/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getDepartmentById: async (id) => {
    try {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error);
      throw error;
    }
  },

  createDepartment: async (departmentData) => {
    try {
      const response = await apiClient.post('/departments', departmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  updateDepartment: async (id, departmentData) => {
    try {
      const response = await apiClient.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating department ${id}:`, error);
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      await apiClient.delete(`/departments/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error);
      throw error;
    }
  },

  getPayrollSummary: async (id, startDate, endDate) => {
    try {
      const query = buildQueryParams({ start: startDate, end: endDate });
      const response = await apiClient.get(`/departments/${id}/summary${query}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll summary for department ${id}:`, error);
      throw error;
    }
  }
};

// Time Entry API services
const timeEntryService = {
  recordTimeEntry: async (timeEntryData) => {
    try {
      const response = await apiClient.post('/time-entries', timeEntryData);
      return response.data;
    } catch (error) {
      console.error('Error recording time entry:', error);
      throw error;
    }
  },

  importEntries: async (entries) => {
    try {
      const response = await apiClient.post('/time-entries/import', entries);
      return response.data;
    } catch (error) {
      console.error('Error importing time entries:', error);
      throw error;
    }
  },

  getEntriesForEmployee: async (employeeId, { startDate, endDate, status } = {}) => {
    try {
      const query = buildQueryParams({ start: startDate, end: endDate, status });
      const response = await apiClient.get(`/time-entries/employee/${employeeId}${query}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching time entries for employee ${employeeId}:`, error);
      throw error;
    }
  },

  updateStatus: async (timeEntryId, status, approvedBy) => {
    try {
      const query = buildQueryParams({ status, approvedBy });
      const response = await apiClient.put(`/time-entries/${timeEntryId}/status${query}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating status for time entry ${timeEntryId}:`, error);
      throw error;
    }
  },

  deleteEntry: async (timeEntryId) => {
    try {
      await apiClient.delete(`/time-entries/${timeEntryId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting time entry ${timeEntryId}:`, error);
      throw error;
    }
  }
};

// Export all services
export { employeeService, payrollService, paySlipService, departmentService, timeEntryService };

// Default export for backward compatibility
export default {
  employee: employeeService,
  payroll: payrollService,
  paySlip: paySlipService,
  department: departmentService,
  timeEntry: timeEntryService
};