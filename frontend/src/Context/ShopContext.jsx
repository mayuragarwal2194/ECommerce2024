import React, { createContext, useState, useEffect } from 'react';
import { getAllProducts } from '../services/api';
import { getDefaultCart } from '../Components/Utils/utils';

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products. Please try again later.');
      }
    };
    fetchProducts();
  }, []);

  // Initialize cart items based on the fetched products
  useEffect(() => {
    if (allProducts.length > 0) {
      setCartItems(getDefaultCart(allProducts));
    }
  }, [allProducts]);

  // Function to add an item to the cart
  const addToCart = (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  // Function to remove one unit of an item from the cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      if (prev[itemId] > 1) {
        return { ...prev, [itemId]: prev[itemId] - 1 };
      } else {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  // Function to delete an item from the cart
  const deleteFromCart = (itemId) => {
    setCartItems(prev => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  };

  // Function to get the total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  const contextValue = {
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;