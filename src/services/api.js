import axios from 'axios';

// Create a new axios instance with a predefined configuration.
// This is where you set the base URL for your Go backend.
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Your Go backend's address
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * This is a crucial part of the setup. An "interceptor" is a function that
 * runs before every single request is sent. Here, we're using it to check
 * if we have a JWT in local storage. If we do, we automatically add the
 * 'Authorization: Bearer <token>' header to the request.
 *
 * This means we don't have to manually add the token to every API call.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // If an error occurs before the request is sent, reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;
