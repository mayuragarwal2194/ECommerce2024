// src/utils/utils.js
export const getDefaultCart = (products) => {
  const cart = {};
  products.forEach(product => {
    if (product._id) { // Ensure ID exists
      cart[product._id] = 0;
    }
  });
  return cart;
};
