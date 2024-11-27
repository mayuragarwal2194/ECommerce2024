import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { addToCart as addToCartAPI, getCart, removeFromCart as removeFromCartAPI, updateQuantityInCart } from '../services/api';
import Cookies from 'js-cookie';

// Create the CartContext
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalWeight: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hardcoded shipping charge
  const shippingCharges = 100; // 100 Rs

  // Function to open the cart drawer
  const openCartDrawer = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  // Function to close the cart drawer
  const closeCartDrawer = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Function to toggle the cart drawer
  const toggleCartDrawer = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // Fetch cart data
  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCart(); // Ensure this returns the correct data format
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error.message);
      setError(error.message || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  };


  // Function to update the quantity of an item in the cart
  const updateItemQuantity = useCallback(async (cartId, productId, variantId, newQuantity, selectedSize, selectedColor) => {
    setLoading(true);
    setError(null);

    try {
      // Call the API to update the quantity
      await updateQuantityInCart(cartId, productId, variantId, newQuantity, selectedSize, selectedColor);

      // Update the cart state with the new cart data
      const finalUpdatedCart = await getCart();
      setCart(finalUpdatedCart); // Assuming the response contains the updated cart
    } catch (error) {
      console.error('Error updating quantity:', error.message);
      setError(error.message || 'Failed to update item quantity.');
    } finally {
      setLoading(false);
    }
  }, []);





  // Function to add an item to the cart and refresh the cart
  const addItemToCart = useCallback(async (productId, variantId, quantity, selectedSize, selectedColor) => {
    try {
      setLoading(true);

      const token = Cookies.get('authToken');
      if (!token) {
        alert('You need to log in to add products to your cart.');
        return;
      }

      // Validate the quantity
      if (typeof quantity !== 'number' || quantity <= 0) {
        alert('Please select a valid quantity greater than 0.');
        return;
      }

      if (!selectedSize) {
        alert('Please select a valid size.');
        return;
      }

      // Construct the payload to send to the API
      const payload = { productId, variantId, quantity, selectedSize, selectedColor };

      // Make the API call to add item to the cart
      const response = await addToCartAPI(payload);

      if (response && response.cart) {
        // Refetch the updated cart to get full product details and update the state
        const updatedCart = await getCart();

        setCart(updatedCart); // Update the cart with the new data
        openCartDrawer(); // Open the cart drawer after adding the item
      }

    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.message || 'Failed to add product to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [openCartDrawer]);


  // Function to remove an item from the cart
  const removeItemFromCart = useCallback(async (productId, variantId, selectedSize, selectedColor) => {
    try {
      setLoading(true);

      const token = Cookies.get('authToken');
      if (!token) {
        alert('You need to log in to remove products from your cart.');
        return;
      }

      // Construct payload for the API call
      const payload = { productId, variantId, selectedSize, selectedColor };

      // Call the remove API
      const response = await removeFromCartAPI(payload);

      if (response && response.cart) {
        setCart(response.cart); // Update the cart after item is removed
      }

    } catch (error) {
      console.error("Error removing from cart:", error);
      alert(error.message || 'Failed to remove product from cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Function to get the total number of items in the cart
  const getTotalCartItems = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart.items]);

  // Memoize total price and total weight calculations
  const getTotalPrice = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.newPrice * item.quantity, 0);
  }, [cart.items]);

  // Calculate the total price including shipping
  const getFinalPrice = useMemo(() => {
    return getTotalPrice + shippingCharges;
  }, [getTotalPrice]);

  const getTotalWeight = useMemo(() => {
    return cart.items.reduce((total, item) => total + item.weight * item.quantity, 0);
  }, [cart.items]);

  const contextValue = useMemo(() => ({
    cart,
    updateItemQuantity,
    addItemToCart,
    removeItemFromCart,
    loading,
    error,
    shippingCharges,
    isCartOpen,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
    getTotalCartItems,
    getTotalPrice,
    getFinalPrice,
    getTotalWeight,
  }), [cart, updateItemQuantity, addItemToCart, removeItemFromCart, loading, error, shippingCharges, isCartOpen, openCartDrawer, closeCartDrawer, toggleCartDrawer, getTotalCartItems, getTotalPrice, getFinalPrice, getTotalWeight]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};