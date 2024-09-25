import React, { useState, useEffect } from 'react';
import './Profile.css';
import Cookies from 'js-cookie';
import { API_URL } from '../../services/api';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({ name: 'User Name', email: 'User Email', picture: '/default-profile.png' });

  useEffect(() => {
    const token = Cookies.get('authToken');
    
    if (token) {
      // Assuming you have an endpoint that retrieves user details
      fetch(`${API_URL}/api/v1/user/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserProfile({
            name: data.username || 'User Name',
            email: data.email || 'User Email',
            picture: data.picture || 'images/default-profile.png', // Use default picture if not provided
          });
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);

  return (
    <div className="profile">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <img src={userProfile.picture} alt="Profile" className="profile-picture" />
        <h2>{userProfile.name}</h2>
        <p>{userProfile.email}</p>
        {/* Add more profile details as needed */}
      </div>
    </div>
  );
};

export default Profile;
