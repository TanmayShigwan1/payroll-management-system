// Base configuration for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
// In production, this will use the environment variable set in Vercel

// Log API URL during development to help with debugging
if (process.env.NODE_ENV === 'development') {
  console.log('API URL:', API_BASE_URL);
}

export const config = {
  apiUrl: API_BASE_URL
};

export default config;