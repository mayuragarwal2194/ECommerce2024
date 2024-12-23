import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { API_URL } from '../services/api';

const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to handle asynchronous operations
  const [error, setError] = useState(null); // Optional error state for handling fetch issues

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      // Fetch user data from API
      fetch(`${API_URL}/api/v1/user/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data. Please log in again.');
          }
          return response.json();
        })
        .then((data) => {
          // console.log('API Response:', data); // Log the entire response
          if (data) {
            setUserInfo(data); // Set user info
            // console.log('User info set:', data); // Log to confirm it's being set
          } else {
            console.error('User data not found in the response:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError(error.message); // Save error message
        })
        .finally(() => {
          setLoading(false); // Stop the loading spinner
        });
    } else {
      setLoading(false); // No token means no need to load user
    }
  }, []);


  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
