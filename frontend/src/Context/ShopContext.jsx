import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getAllProducts } from '../services/api';
import { getDefaultCart } from '../Components/Utils/utils';
import Cookies from 'js-cookie';

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

  

  // Function to remove one unit of an item from the cart
  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      if (prev[itemId] > 1) {
        return { ...prev, [itemId]: prev[itemId] - 1 };
      } else {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  // Function to delete an item from the cart
  const deleteFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Function to get the total number of items in the cart
  const getTotalCartItems = useMemo(() => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  }, [cartItems]);

  const contextValue = useMemo(() => ({
    allProducts,
    cartItems,
    removeFromCart,
    deleteFromCart,
    getTotalCartItems,
    
  }), [allProducts, cartItems, getTotalCartItems, removeFromCart, deleteFromCart, ]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;