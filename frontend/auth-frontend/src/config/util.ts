import axios from 'axios';

// Make sure to send cookies with each request
axios.defaults.withCredentials = true;

// Helper function to get the CSRF token from the cookies
export const getCSRFToken = () => {
    const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('_csrf='));
  return cookieValue ? cookieValue.split('=')[1] : undefined;
}

export const axiosUtil = () => {
    // Set CSRF token in headers of Axios requests
axios.interceptors.request.use((config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken; // Attach CSRF token to each request
    }
    return config;
  });
}