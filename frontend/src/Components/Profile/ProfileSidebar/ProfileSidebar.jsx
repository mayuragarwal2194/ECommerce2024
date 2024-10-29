import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './ProfileSidebar.css';
import { API_URL } from '../../../services/api';
import ProfileEditForm from '../ProfileEditForm/ProfileEditForm';

const ProfileSidebar = ({ tabData }) => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState(tabData.length > 0 ? tabData[0].label.title : null);
  const [userProfile, setUserProfile] = useState({
    name: 'User Name',
    email: 'User Email',
    profilePicture: 'images/default-profile.png',
  });

  const [isEditing, setIsEditing] = useState(false);


  // Fetch the user profile data when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) return;

        const response = await fetch(`${API_URL}/api/v1/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the headers
          },
        });

        const data = await response.json();
        setUserProfile({
          name: data.username || 'User Name',
          email: data.email || 'User Email',
          profilePicture: data.profilePicture
            ? `${data.profilePicture}`
            : 'images/default-profile.png',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="profile-sidebar d-flex">
      {/* Sidebar with profile info */}
      <div className="sidebar-nav">
        <div className="profile">
          <div className="profile-info">
            <div className='edit-profile-btn d-flex align-items-center gap-1 w-100 justify-content-end cursor-pointer user-select-none' onClick={() => {
              setIsEditing(true);
              setActiveTab(null); // Clear active tab when editing
            }}>
              <span className='text-uppercase'>Edit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 18.89H6.41421L15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89ZM21 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L9.24264 18.89H21V20.89ZM15.7279 6.74785L17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785Z"></path>
              </svg>
            </div>
            {/* Profile info */}
            <div className='d-lg-flex text-center text-lg-start gap-4 align-items-center'>
              <img
                src={
                  userProfile.profilePicture && userProfile.profilePicture.startsWith('http')
                    ? userProfile.profilePicture
                    : userProfile.profilePicture && !userProfile.profilePicture.includes('default-profile.png')
                      ? `${API_URL}/${userProfile.profilePicture}`
                      : 'images/default-profile.png'
                }
                onError={(e) => {
                  e.target.src = 'images/default-profile.png';
                }}
                alt="Profile"
                className="profile-picture object-position-top"
              />
              <div>
                <h2 className='user-profile-name text-capitalize'>
                  Hey {userProfile.name}
                </h2>
                <p className='mb-0 user-profile-email'>{userProfile.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Tabs */}
        {tabData.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-item user-select-none ${activeTab === tab.label.title && !isEditing ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.label.title); // Use tab.label.title
              setIsEditing(false); // Reset edit mode on tab click
            }}

          >
            <div className="sub-content-flex d-flex align-items-start gap-3">
              <span>{tab.label.icon}</span>
              <div className="sub-content-css">
                <h3 className='fw-600'>{tab.label.title}</h3>
                <p className='mb-0'>{tab.label.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content based on active tab or edit form */}
      <div className="sidebar-content">
        {isEditing ? (
          <ProfileEditForm
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onCancel={() => setIsEditing(false)} // Close form on cancel
          />
        ) : (
          tabData.map((tab) => (
            <div
              key={tab.id}
              style={{ display: activeTab === tab.label.title ? 'block' : 'none' }}
            >
              {tab.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;