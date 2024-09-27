import React, { useState, useEffect } from 'react';
import './Profile.css';
import Cookies from 'js-cookie';
import { API_URL } from '../../services/api';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'User Name',
    email: 'User Email',
    profilePicture: 'images/default-profile.png',
  });
  const [editProfileMode, setEditProfileMode] = useState(false); // For editing username and email
  const [editPictureMode, setEditPictureMode] = useState(false); // For editing profile picture
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: null, // Added for file upload
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
            profilePicture: data.profilePicture
              ? `${API_URL}/${data.profilePicture}`
              : 'images/default-profile.png', // Use default picture if not provided
          });
          setFormData({
            name: data.username || 'User Name',
            email: data.email || 'User Email',
            profilePicture: null,
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

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0], // Set the selected file
    });
  };

  const handleProfileFormSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    const profileData = {
      username: formData.name,
      email: formData.email,
    };

    if (token) {
      fetch(`${API_URL}/api/v1/user/edit`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData), // Send JSON data for username and email
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setMessage(data.message);
            setUserProfile({
              ...userProfile,
              name: formData.name,
              email: formData.email,
            });
            setEditProfileMode(false); // Exit edit mode after successful update
          }
        })
        .catch((error) => {
          setMessage('Error updating profile.');
          console.error('Error updating profile:', error);
        });
    }
  };

  const handlePictureFormSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    const formDataToSend = new FormData();
    
    // Append the profile picture if provided
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    if (token) {
      fetch(`${API_URL}/api/v1/user/Profile-Picture`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend, // Send the FormData
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setMessage(data.message);
            setUserProfile({
              ...userProfile,
              profilePicture: data.profilePicture ? `${API_URL}/${data.profilePicture}` : userProfile.profilePicture,
            });
            setEditPictureMode(false); // Exit edit mode after successful update
          }
        })
        .catch((error) => {
          setMessage('Error updating profile picture.');
          console.error('Error updating profile picture:', error);
        });
    }
  };

  return (
    <div className="profile">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <img src={userProfile.profilePicture} alt="Profile" className="profile-picture object-position-top" />
        {editPictureMode ? (
          <form onSubmit={handlePictureFormSubmit} className="profile-edit-form">
            <div>
              <label htmlFor='profilePicture' className='cursor-pointer'>Profile Picture:</label>
              <input
                type="file"
                name="profilePicture"
                id='profilePicture'
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit">Save Profile Picture</button>
          </form>
        ) : (
          <>
            <h2>{userProfile.name}</h2>
            <p>{userProfile.email}</p>
            <button onClick={() => setEditProfileMode(true)}>
              Edit Username/Email
            </button>
          </>
        )}
        {editProfileMode && (
          <form onSubmit={handleProfileFormSubmit} className="profile-edit-form">
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
            <button onClick={() => setEditProfileMode(false)}>Cancel</button>
          </form>
        )}
        <button onClick={() => setEditPictureMode(!editPictureMode)}>
          {editPictureMode ? 'Cancel Profile Picture Edit' : 'Edit Profile Picture'}
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Profile;