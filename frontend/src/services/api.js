import Cookies from 'js-cookie';
import { isAuthenticated } from '../Components/Utils/utils';
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
  console.log(data);
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

    // If the response is empty (no products in wishlist), return an empty array
    if (Array.isArray(data) && data.length === 0) {
      return [];  // Returning an empty array if no products
    }

    // Process and return the wishlist data, including variant-specific details
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









