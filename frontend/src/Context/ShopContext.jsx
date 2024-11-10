import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getAllProducts } from '../services/api';
import { getDefaultCart } from '../Components/Utils/utils';

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false); // Added state for cart drawer

  // Function to open the cart drawer
  const openCartDrawer = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  // Function to close the cart drawer
  const closeCartDrawer = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Function to toggle the cart drawer
  const toggleCartDrawer = () => setIsCartOpen(prev => !prev);

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
  const addToCart = useCallback((itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    openCartDrawer(); // Open cart drawer when item is added
  }, [openCartDrawer]);

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
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartItems,
    isCartOpen,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
  }), [allProducts, cartItems, getTotalCartItems, isCartOpen, addToCart, removeFromCart, deleteFromCart, openCartDrawer, closeCartDrawer]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;