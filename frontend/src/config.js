// Base configuration for API calls
// Use a relative URL approach to avoid cross-origin issues in Codespaces
let API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Log API URL during development to help with debugging
if (process.env.NODE_ENV === 'development') {
  console.log('API URL:', API_BASE_URL);
}

export const config = {
  apiUrl: API_BASE_URL
};

export default config;