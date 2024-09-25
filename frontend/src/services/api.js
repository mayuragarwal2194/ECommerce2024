export const API_URL = 'http://localhost:5000';

// Only for Mobile Testing
// export const API_URL = 'http://192.168.1.4:5000';

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

// Login
export const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    return data.token; // Return the token
  } catch (err) {
    console.error('Error logging in:', err);
    throw err;
  }
};

// Signup
export const handleSignUp = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/user/signup`, {
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




