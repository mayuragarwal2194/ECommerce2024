import Cookies from 'js-cookie'; // Make sure to import Cookies
import { toast } from 'react-toastify'; // Ensure toast is imported

const API_URL = process.env.REACT_APP_API_URL; // Your API base URL

// Custom fetch function to handle token expiration
export const customFetch = async (url, options = {}, setUserProfile) => {
  const token = Cookies.get('authToken');

  // Add the Authorization header to the request if the token exists
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(`${API_URL}${url}`, options);

    if (response.status === 401) {
      // If the response status is 401 (Unauthorized), the token might be expired
      handleTokenExpiration(setUserProfile); // Pass setUserProfile to handleLogout
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const handleTokenExpiration = (setUserProfile) => {
  toast.error('Session expired. Please log in again.', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  handleLogout(setUserProfile);
};

const handleLogout = (setUserProfile) => {
  Cookies.remove('authToken');
  setUserProfile(null); // Clear user data in state
  window.location.href = '/login'; // Redirect to login page
};