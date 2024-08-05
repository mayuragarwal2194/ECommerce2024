import React, { createContext, useState, useEffect } from 'react';
import { getAllProducts, getParentCategories, getChildCategories } from '../Services/api';

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const parents = await getParentCategories();
        const children = await getChildCategories();
        setParentCategories(parents);
        setChildCategories(children);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const getDefaultCart = (products) => {
    let cart = {};
    products.forEach(product => {
      cart[product._id] = 0; // Ensure you are using the correct ID field
    });
    return cart;
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      setCartItems(getDefaultCart(allProducts));
    }
  }, [allProducts]);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (prev[itemId] > 1) {
        return { ...prev, [itemId]: prev[itemId] - 1 };
      } else {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
    });
  };

  const deleteFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, num) => total + num, 0);
  };

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();
      setAllProducts(products);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const contextValue = {
    allProducts,
    parentCategories,
    childCategories,
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartItems,
    fetchProducts, // Expose fetchProducts in the context
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;