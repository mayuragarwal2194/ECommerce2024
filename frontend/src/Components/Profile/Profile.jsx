import React, { useState, useEffect } from 'react';
import './Profile.css';
import Cookies from 'js-cookie';
import { API_URL } from '../../services/api';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'User Name',
    email: 'User Email',
    picture: 'images/default-profile.png',
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = Cookies.get('authToken');

    if (token) {
      // Fetch the current user profile data
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
          setFormData({
            name: data.username || 'User Name',
            email: data.email || 'User Email',
          });
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    if (token) {
      fetch(`${API_URL}/api/v1/user/edit`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setMessage(data.message);
            setUserProfile({
              name: formData.name,
              email: formData.email,
              picture: userProfile.picture,
            });
            setEditMode(false); // Exit edit mode after successful update
          }
        })
        .catch((error) => {
          setMessage('Error updating profile.');
          console.error('Error updating profile:', error);
        });
    }
  };

  return (
    <div className="profile">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <img src={userProfile.picture} alt="Profile" className="profile-picture" />
        {editMode ? (
          <form onSubmit={handleFormSubmit} className="profile-edit-form">
            <div>
              <label htmlFor='username' className='cursor-pointer'>Username:</label>
              <input
                type="text"
                name="name"
                id='username'
                value={formData.name}
                onChange={handleInputChange}
                autoComplete='true'
              />
            </div>
            <div>
              <label htmlFor='useremail' className='cursor-pointer'>Email:</label>
              <input
                type="email"
                name="email"
                id='useremail'
                value={formData.email}
                onChange={handleInputChange}
                autoComplete='true'
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        ) : (
          <>
            <h2>{userProfile.name}</h2>
            <p>{userProfile.email}</p>
          </>
        )}
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Profile;