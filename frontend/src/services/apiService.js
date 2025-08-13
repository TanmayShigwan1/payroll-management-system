import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Generic API methods
  async get(url, config = {}) {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put(url, data = {}, config = {}) {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  // Specific API calls
  async getInheritanceDemo() {
    return await this.get('/api/inheritance-demo/demo');
  }

  async getInheritanceHierarchy() {
    return await this.get('/api/inheritance-demo/inheritance-hierarchy');
  }

  async getEmployees() {
    return await this.get('/api/employees');
  }

  async getDepartments() {
    return await this.get('/api/departments');
  }

  async getDesignations() {
    return await this.get('/api/designations');
  }

  async getPayrollRecords() {
    return await this.get('/api/payroll');
  }

  async getReports() {
    return await this.get('/api/reports');
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/actuator/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'DOWN', error: error.message };
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server Error: ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error - please check your connection and backend server');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Get API base URL
  getBaseUrl() {
    return API_BASE_URL;
  }
}

export default new ApiService();
