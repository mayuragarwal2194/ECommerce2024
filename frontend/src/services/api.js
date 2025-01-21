import Cookies from 'js-cookie';
import { isAuthenticated } from '../Components/Utils/utils';
import { customFetch } from '../Components/Utils/apiClient';
export const API_URL = 'http://localhost:5000';

// Only for Mobile Testing
// export const API_URL = 'http://192.168.1.7:5000';

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to fetch all sizes from the backend
export const getAllSizes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/size`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const sizes = await response.json();
    return sizes;

  } catch (error) {
    console.error('Error fetching sizes:', error);
    return []; // Return empty array if error occurs
  }
};

// Get all parents categories
export const fetchParentCategories = async () => {
  const response = await fetch(`${API_URL}/api/v1/parentcategories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  // console.log(data);
  return data;
};

// Get all Child categories
export const fetchChildCategories = async () => {
  const response = await fetch(`${API_URL}/api/v1/childcategories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  // console.log(data);
  return data;
};

// Get all Top Categories
export const fetchTopCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/topcategories`);
    if (!response.ok) {
      throw new Error('Failed to fetch parent categories');
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    throw error;
  }
}


// New function to fetch products by category
export const getProductsByTopCategory = async (categoryId) => {
  try {
    // console.log('Fetching products for category ID:', categoryId);

    const response = await fetch(`${API_URL}/products/category/${categoryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();

    if (data.length === 0) {
      console.info('No products found for this category.');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get Products By Parent Category
export const fetchProductsByParentCategory = async (parentId) => {
  try {
    const response = await fetch(`${API_URL}/products/parentcat/${parentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();

    if (data.length === 0) {
      console.info('No products found for this category.');
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get Products By Child Category
export const fetchProductsByChildCategory = async (childId) => {
  try {
    const response = await fetch(`${API_URL}/products/childcat/${childId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      console.info('No products found for this category.');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Updated handleLogin to process the server response
export const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return error message for unverified email
      throw new Error(data.message || 'Invalid Credentials');
    }

    return { token: data.token }; // Return the token if successful
  } catch (err) {
    console.error('Error logging in:', err);
    throw err; // Throw the error to be caught in handleSubmit
  }
};

// Signup
export const handleSignUp = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data; // You can return any data received, such as a success message
  } catch (err) {
    console.error('Error signing up:', err);
    throw err;
  }
};

// Google Sign Up
export const handleGoogleSignUp = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/google-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data.token; // Ensure your backend returns the token
  } catch (error) {
    console.error('Error during Google signup:', error);
    throw error; // Re-throw the error to be handled in the component
  }
};

// Fetch Countries
export const fetchCountries = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/delivery-info/countries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const countries = await response.json();
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// Fetch States By Country
export const fetchStatesByCountry = async (countryCode) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/delivery-info/countries/${countryCode}/states`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const states = await response.json();
    return states;
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
};

// Fetch Cities by State
export const fetchCitiesByState = async (countryCode, stateCode) => {
  try {
    console.log(`Fetching cities for Country: ${countryCode}, State: ${stateCode}`); // Debugging line
    const response = await fetch(`${API_URL}/api/v1/delivery-info/countries/${countryCode}/states/${stateCode}/cities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const cities = await response.json();
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

// Function to fetch delivery information for the logged-in user
export const fetchDeliveryInfo = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/delivery-info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the headers
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch delivery information');
    }

    return await response.json(); // Return the response data
  } catch (error) {
    console.error('Error fetching delivery info:', error);
    throw error; // Re-throw the error for further handling if needed
  }
};

// Function to fetch wishlist
export const getWishlist = async () => {
  const token = Cookies.get('authToken');

  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/user/wishlist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Handle the response status
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }

    const data = await response.json();

    // If the response is an empty array, return it directly
    if (Array.isArray(data) && data.length === 0) {
      return []; // No products in wishlist
    }

    // Ensure the response has a `products` field before mapping
    if (data && data.products) {
      return data.products.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        itemName: item.itemName,
        newPrice: item.newPrice,
        oldPrice: item.oldPrice,
        featuredImage: item.featuredImage,
        tag: item.tag,
        color: item.color,
        size: item.size,
        addedAt: item.addedAt,
      }));
    }

    // Fallback: If `data` doesn't contain `products`, return an empty array
    return [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Function to add a product to the wishlist
export const addToWishlist = async (productId, variantId) => {
  // Retrieve the auth token from cookies
  const token = Cookies.get('authToken');
  console.log("Auth token:", token); // Log the token to verify it's available

  // Check if the user is authenticated
  if (!isAuthenticated()) {
    console.log('User not authenticated');
    return;
  }

  // Log the data being sent to the API
  const payload = { productId, variantId };
  console.log('Sending payload to add product to wishlist:', payload);

  try {
    // Send the API request to add the product to the wishlist
    const response = await fetch(`${API_URL}/api/v1/user/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Log the API response status
    console.log('API Response Status:', response.status);

    // If the response is not OK, log the error details and throw an error
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Response:', errorData);
      throw new Error(`Failed to add product to wishlist: ${errorData.message || response.statusText}`);
    }

    // If successful, log the success message from the response
    const data = await response.json();
    console.log('Product added to wishlist:', data.message);

    return data; // Optionally return the response data for further use

  } catch (error) {
    // Log the error and rethrow it
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Function to remove a product variant from the wishlist
export const removeFromWishlist = async (productId, variantId) => {
  if (!isAuthenticated()) {
    console.log('User not authenticated');
    return null;
  }

  const token = Cookies.get('authToken');
  if (!token) {
    console.log('Authentication token not found');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/user/wishlist/${productId}/${variantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove product variant from wishlist');
    }

    const data = await response.json();
    console.log(data.message); // Optional, for debugging
    return data; // Optionally return data for further use
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};


// Function to add a product to Cart
export const addToCart = async (payload) => {
  const token = Cookies.get('authToken');
  if (!token) {
    alert('You need to log in to add products to your cart.');
    return;
  }

  console.log('Prepared payload for API call:', payload); // Log the received payload

  try {
    const response = await fetch(`${API_URL}/api/v1/user/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // Send the entire payload here
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error adding product to cart:', errorData);
      throw new Error(errorData.message || 'Failed to add to cart');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error occurred while adding to cart:', error);
    throw error;
  }
};

// Function to fetch the user's cart
export const getCart = async () => {
  const token = Cookies.get('authToken');

  // Check if the user is authenticated
  if (!token) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }

  try {
    // Send the API request to get the cart
    const response = await fetch(`${API_URL}/api/v1/user/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // If the cart does not exist, initialize an empty cart
    if (response.status === 404) {
      console.info('Cart not found, initializing an empty cart.');
      return { items: [], totalPrice: 0 }; // Return an empty cart object
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch cart: ${errorData.message || 'Unknown error'}`);
    }

    // Parse and return the cart data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    throw error;
  }
};



// Function to Remove Item From Cart
export const removeFromCart = async ({ productId, variantId, selectedSize, selectedColor }) => {
  const token = Cookies.get('authToken');

  // Check if the user is authenticated
  if (!token) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/user/cart/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        variantId,
        selectedSize,
        selectedColor,
      }),
    });

    // Check response status
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      throw new Error(errorData.message || 'Failed to remove item from cart');
    }

    // Parse and return the updated cart
    const data = await response.json();
    console.log('Cart updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    throw error;
  }
};

// Function to update the quantity of a cart item
export const updateQuantityInCart = async (cartId, productId, variantId, newQuantity, selectedSize, selectedColor) => {
  const token = Cookies.get('authToken');

  try {
    const response = await fetch(`${API_URL}/api/v1/user/cart/quantity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        cartId,
        productId,
        variantId,
        newQuantity,
        selectedSize,
        selectedColor,
      }),
    });

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating quantity');
    }

    // Parse the response data (updated cart)
    const data = await response.json();
    return data; // Response will contain updated cart info
  } catch (error) {
    console.error('Error updating quantity:', error.message);
    throw error;
  }
};






// Function to submit a product review
export const addReview = async (reviewData, reviewFiles, setUserProfile) => {
  console.log("Auth token:", Cookies.get('authToken')); // Log the token for debugging

  // Check if the user is authenticated (optional, if customFetch handles token checks)
  if (!isAuthenticated()) {
    console.log('User not authenticated');
    return;
  }

  const formData = new FormData();
  formData.append('productId', reviewData.productId);
  formData.append('rating', reviewData.rating);
  formData.append('reviewTitle', reviewData.reviewTitle);
  formData.append('comment', reviewData.comment);

  if (reviewFiles.images) {
    reviewFiles.images.forEach((file) => formData.append('reviewImages', file));
  }
  if (reviewFiles.videos) {
    reviewFiles.videos.forEach((file) => formData.append('reviewVideos', file));
  }

  // Debugging: Log FormData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await customFetch('/api/v1/reviews', {
      method: 'POST',
      body: formData,
    }, setUserProfile); // Pass setUserProfile to handle token expiration

    console.log('API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Response:', errorData);
      throw new Error(`Failed to submit review: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Review submitted successfully:', data);
    return data;

  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// Function to fetch reviews for a specific product
export const getProductReviews = async (productId, page = 1, limit = 10) => {
  try {
    // Construct the URL with query parameters for pagination
    const url = `${API_URL}/api/v1/reviews/${productId}?page=${page}&limit=${limit}`;

    // Send the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log the API response status
    // console.log('API Response Status:', response.status);

    // If the response is not OK, log the error details and throw an error
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Response:', errorData);
      throw new Error(`Failed to fetch reviews: ${errorData.message || response.statusText}`);
    }

    // If successful, parse and return the JSON response
    const data = await response.json();
    // console.log('Fetched reviews:', data);

    return data; // Optionally return the response data for further use

  } catch (error) {
    // Log the error and rethrow it
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Function to delete review
export const deleteReview = async (reviewId) => {
  try {
    const authToken = Cookies.get('authToken');
    const response = await fetch(`${API_URL}/api/v1/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Function to edit Review
export const editReview = async (reviewId, reviewData, reviewFiles) => {
  const formData = new FormData();

  // Log the reviewId to check its value
  console.log('Review ID:', reviewId);
  if (!reviewId || typeof reviewId !== 'string') {
    throw new Error('Invalid reviewId');
  }

  // formData.append('reviewId', reviewId); // Ensure it's the correct string

  // Append review data
  Object.keys(reviewData).forEach((key) => {
    if (reviewData[key]) {
      if (Array.isArray(reviewData[key])) {
        // Handle arrays (like existing images and videos)
        appendArrayToFormData(formData, key, reviewData[key]);
      } else {
        formData.append(key, reviewData[key]);
      }
    }
  });

  // Append new review images and videos if they exist
  appendFilesToFormData(formData, 'reviewImages', reviewFiles?.images);
  appendFilesToFormData(formData, 'reviewVideos', reviewFiles?.videos);

  // Log the formData contents for debugging (only for development, remove for production)
  if (process.env.NODE_ENV === 'development') {
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  }

  // Retrieve the token from cookies
  const authToken = Cookies.get('authToken');
  if (!authToken) {
    throw new Error('Authentication token is missing');
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/reviews/editReview`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`, // Using the token from cookies
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error updating review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    throw new Error('Error updating review: ' + error.message);
  }
};

// Helper function to append array data to FormData
const appendArrayToFormData = (formData, key, array) => {
  array.forEach((item) => formData.append(key, item));
};

// Helper function to append files to FormData
const appendFilesToFormData = (formData, fieldName, files) => {
  if (files?.length) {
    files.forEach((file) => formData.append(fieldName, file));
  }
};












// Function to apply the coupon
export const applyCoupon = async (code) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

  try {
    const response = await fetch(`${API_URL}/api/v1/coupon/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`,
      },
      body: JSON.stringify({ code }),
      signal: controller.signal,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to apply coupon');

    return result.data;
  } finally {
    clearTimeout(timeout); // Clean up the timeout
  }
};

// Function to remove the applied coupon
export const removeCoupon = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

  try {
    const response = await fetch(`${API_URL}/api/v1/coupon/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`,
      },
      body: JSON.stringify({}), // Empty body
      signal: controller.signal,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to remove coupon');

    return result.data;
  } finally {
    clearTimeout(timeout); // Clean up the timeout
  }
};


