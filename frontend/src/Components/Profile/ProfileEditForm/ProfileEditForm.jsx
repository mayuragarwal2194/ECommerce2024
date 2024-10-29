import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { API_URL } from '../../../services/api';

const ProfileEditForm = ({ userProfile, setUserProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Populate formData with userProfile once it is available
  useEffect(() => {
    if (userProfile && userProfile.name && userProfile.email) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
      });
    }
  }, [userProfile]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileFormSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    const profileData = {
      username: formData.name,
      email: formData.email,
    };

    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/v1/user/edit`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (data.message) {
          if (data.message === 'Email already exists') {
            toast.error('This email is already in use. Please try another one.');
          } else {
            toast.success('Profile updated successfully!');

            // Update the parent component's userProfile state to reflect changes
            setUserProfile({
              ...userProfile,
              name: formData.name,
              email: formData.email,
            });
          }
        } else {
          toast.error('Failed to update profile. Please try again.');
        }
      } catch (error) {
        toast.error('Error updating profile. Please try again later.');
        console.error('Error updating profile:', error);
      }
    } else {
      toast.warn('You are not authenticated. Please log in again.');
    }
  };

  return (
    <form onSubmit={handleProfileFormSubmit} className="profile-edit-form">
      <div className='d-flex align-items-end justify-content-between gap-5'>
        <div className='d-flex gap-4 flex-1'>
          <div className='w-50'>
            <label htmlFor="username" className="cursor-pointer d-block mb-1">
              Username:
            </label>
            <input
              type="text"
              name="name"
              id="username"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="true"
              className='px-2 py-1 w-100'
            />
          </div>
          <div className='w-50'>
            <label htmlFor="useremail" className="cursor-pointer d-block mb-1">
              Email:
            </label>
            {userProfile.googleId ? (
              <input
                type="email"
                name="email"
                id="useremail"
                value={formData.email}
                readOnly
                className='px-2 py-1 w-100 bg-light text-muted'
              />
            ) : (
              <input
                type="email"
                name="email"
                id="useremail"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="true"
                className='px-2 py-1 w-100'
              />
            )}
          </div>
        </div>
        <button type="submit" className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content'>
          Update
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;