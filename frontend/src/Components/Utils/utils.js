import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export const getDefaultCart = (products) => {
  const cart = {};
  products.forEach(product => {
    if (product._id) { // Ensure ID exists
      cart[product._id] = 0;
    }
  });
  return cart;
};

// Check if the token exists and is still valid
export const isAuthenticated = () => {
  const token = Cookies.get('authToken');

  if (!token) {
    return false; // No token means the user is not authenticated
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    if (decodedToken.exp < currentTime) {
      Cookies.remove('authToken'); // Remove expired token from cookies
      return false; // Token has expired, user is not authenticated
    }

    return true; // Token is valid, user is authenticated
  } catch (error) {
    console.error('Error decoding token:', error);
    Cookies.remove('authToken'); // Remove the token if there's an error decoding it
    return false; // Token is invalid, user is not authenticated
  }
};

export const redirectToLoginIfNotAuthenticated = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
};

// Redirect to login page if not authenticated
export const PrivateRoute = ({ element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

