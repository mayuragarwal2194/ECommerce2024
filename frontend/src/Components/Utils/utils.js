import Cookies from 'js-cookie';

export const getDefaultCart = (products) => {
  const cart = {};
  products.forEach(product => {
    if (product._id) { // Ensure ID exists
      cart[product._id] = 0;
    }
  });
  return cart;
};

export const isAuthenticated = () => !!Cookies.get('authToken');

export const redirectToLoginIfNotAuthenticated = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login'; // Redirect to login if not authenticated
  }
};

