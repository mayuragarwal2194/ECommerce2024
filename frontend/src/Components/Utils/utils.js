import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

export const getDefaultCart = (products) => {
  const cart = {};
  products.forEach(product => {
    if (product._id) { // Ensure ID exists
      cart[product._id] = 0;
    }
  });
  return cart;
};

export const isAuthenticated = () => {
  const token = Cookies.get('authToken');
  console.log('Token:', token); // Check if the token is present
  return !!token;
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

