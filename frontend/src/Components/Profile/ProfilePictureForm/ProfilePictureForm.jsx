import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { API_URL } from '../../../services/api';
import { toast } from 'react-toastify';

const ProfilePictureForm = ({ userProfile, setUserProfile }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    const formData = new FormData();

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/user/Profile-Picture`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.message === 'Profile picture updated successfully') {
        toast.success('Profile picture updated successfully!');
        setUserProfile({
          ...userProfile,
          profilePicture: data.profilePicture
            ? `${API_URL}/${data.profilePicture}`
            : userProfile.profilePicture,
        });
        setProfilePicture(null); // Reset the file input
      } else {
        toast.error('Failed to update profile picture.');
      }
    } catch (error) {
      toast.error('Error updating profile picture.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form">
      <div className='d-lg-flex align-items-end justify-content-between'>
        <div>
          <label htmlFor="profilePicture" className="cursor-pointer d-block mb-1">
            Profile Picture:
          </label>
          <input
            type="file"
            name="profilePicture"
            id="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className='ff-btn ff-btn-small ff-btn-fill-dark'>
          Save
        </button>
      </div>
    </form>
  );
};

export default ProfilePictureForm;