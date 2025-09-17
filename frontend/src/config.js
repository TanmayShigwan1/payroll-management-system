// Base configuration for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const config = {
  apiUrl: API_BASE_URL
};

export default config;