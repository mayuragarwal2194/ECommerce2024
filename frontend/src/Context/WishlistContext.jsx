// WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist as removeWishlistAPI } from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Derived state for wishlist count
    const wishlistCount = wishlist.length;

    // Fetch the wishlist items when the component mounts
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const products = await getWishlist();
                setWishlist(products);
            } catch (error) {
                console.error('Failed to load wishlist:', error);
                setError('Failed to load wishlist. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    // Add item to wishlist and update state
    const addToWishlistContext = async (productId, variantId) => {
        if (wishlist.some(item => item.productId === productId && item.variantId === variantId)) {
            console.log('Item already in wishlist');
            return;
        }

        try {
            await addToWishlist(productId, variantId);
            // Refetch the updated wishlist to get full product details
            const updatedWishlist = await getWishlist();
            setWishlist(updatedWishlist);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };


    // Remove item variant from wishlist and update state
    const removeFromWishlistContext = async (productId, variantId) => {
        try {
            await removeWishlistAPI(productId, variantId); // Pass both productId and variantId
            setWishlist(prevWishlist =>
                prevWishlist.filter(item =>
                    !(item.productId === productId && item.variantId === variantId)
                )
            );
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };


    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount,
            loading,
            error,
            addToWishlist: addToWishlistContext,
            removeFromWishlist: removeFromWishlistContext
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);