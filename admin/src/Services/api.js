export const API_URL = 'http://localhost:5000';

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getTopCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/topcategories`);
    if (!response.ok) {
      throw new Error('Failed to fetch parent categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    throw error;
  }
}

export const getParentCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/parentcategories`);
    if (!response.ok) {
      throw new Error('Failed to fetch parent categories');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    throw error;
  }
};

export const getChildCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/childcategories`);
    if (!response.ok) {
      throw new Error('Failed to fetch child categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching child categories:', error);
    throw error;
  }
};

export const getAvailableSizes = async () => {
  try {
    const response = await fetch(`${API_URL}/size`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const sizes = await response.json();
    return sizes;
  } catch (error) {
    console.error('Error fetching available sizes:', error);
    throw error;
  }
};
