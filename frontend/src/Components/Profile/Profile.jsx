import React, { useState, useEffect } from 'react';
import './Profile.css';
import Cookies from 'js-cookie';
import { API_URL } from '../../services/api';
import PasswordResetRequest from './PasswordResetRequest/PasswordResetRequest';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileSidebar from './ProfileSidebar/ProfileSidebar';
import ProfilePictureForm from './ProfilePictureForm/ProfilePictureForm';
import SavedAddress from './SavedAddress/SavedAddress';
import { useLocation } from 'react-router-dom';
import Wishlist from './Wishlist/Wishlist';


const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'User Name',
    email: 'User Email',
    profilePicture: 'images/default-profile.png',
  });

  const location = useLocation();
  const openTab = location.state?.openTab || '';

  // Fetch the user profile data when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the headers
          },
        });

        const data = await response.json();

        // Update user profile and form data
        setUserProfile({
          name: data.username || 'User Name',
          email: data.email || 'User Email',
          profilePicture: data.profilePicture
            ? `${data.profilePicture}`
            : 'images/default-profile.png',
          googleId: data.googleId,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile. Please try again later.');
      }
    };

    const token = Cookies.get('authToken');

    if (token) {
      fetchUserProfile();
    }
  }, []);


  const tabData = [
    {
      id: 1,
      label: {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2.37793 5.58008L9.00042 9.41257L15.5779 5.60255" stroke="#221F20" strokeOpacity="0.9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M9 16.2078V9.40527" stroke="#221F20" strokeOpacity="0.9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M7.44795 1.86L3.44296 4.08752C2.53545 4.59002 1.79297 5.85001 1.79297 6.88501V11.1225C1.79297 12.1575 2.53545 13.4175 3.44296 13.92L7.44795 16.1475C8.30295 16.62 9.70545 16.62 10.5604 16.1475L14.5655 13.92C15.473 13.4175 16.2155 12.1575 16.2155 11.1225V6.88501C16.2155 5.85001 15.473 4.59002 14.5655 4.08752L10.5604 1.86C9.69795 1.38 8.30295 1.38 7.44795 1.86Z" stroke="#221F20" strokeOpacity="0.9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M12.7503 9.93021V7.18523L5.63281 3.0752" stroke="#428BC1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        ),
        title: 'My Orders',
        description: 'Check your Order Status'
      },
      content: (
        <div className='w-100 text-center '>
          <img src="/images/no-orders.svg" alt="" />
          <h5 className='fw-bold'>You have no recent orders!</h5>
          <p>
            Browse more products and find something you like
          </p>
          <button className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content'>Start Shopping</button>
        </div>
      )
    },
    {
      id: 2,
      label: {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"></path></svg>
        ),
        title: 'Wishlist',
        description: 'Shop From Your Wishlist'
      },
      content: (
        <Wishlist />
      )
    },
    {
      id: 3,
      label: {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 7.44232C3.75 11.0812 6.93336 14.0904 8.34239 15.2441L8.34295 15.2445C8.54499 15.41 8.64605 15.4927 8.79664 15.5351C8.91379 15.5681 9.0861 15.5681 9.20325 15.5351C9.35398 15.4927 9.4553 15.4098 9.65772 15.2441C11.0668 14.0904 14.25 11.0812 14.25 7.4423C14.25 6.06521 13.6969 4.74454 12.7123 3.77079C11.7277 2.79705 10.3924 2.25 9.00003 2.25C7.60764 2.25 6.27226 2.79704 5.28769 3.77078C4.30312 4.74453 3.75 6.06524 3.75 7.44232Z" stroke="#221F20" strokeOpacity="0.9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M7.5 6.75C7.5 7.57843 8.17157 8.25 9 8.25C9.82843 8.25 10.5 7.57843 10.5 6.75C10.5 5.92157 9.82843 5.25 9 5.25C8.17157 5.25 7.5 5.92157 7.5 6.75Z" stroke="#428BC1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        ),
        title: 'Saved Address',
        description: 'Saved Addresses for effortless checkout'
      },
      content: (
        <div>
          <SavedAddress />
        </div>
      )
    },
    {
      id: 4,
      label: {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={'20px'} fill="currentColor"><path d="M6 8V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6ZM19 10H5V20H19V10ZM11 15.7324C10.4022 15.3866 10 14.7403 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 14.7403 13.5978 15.3866 13 15.7324V18H11V15.7324ZM8 8H16V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8Z"></path></svg>
        ),
        title: 'Request Password Reset',
        description: 'Change Your Password'
      },
      content: (
        !userProfile.googleId ? (
          <PasswordResetRequest />
        ) : (
          <p>Password reset is not applicable for Google login.</p>
        )
      ),
    }
  ]

  return (
    <div className='py-5 profile-main'>
      <div className="container">
        <div className="edit-profile w-100 mt-3 mt-lg-0">
          <ProfileSidebar tabData={tabData} initialTab={openTab} />
        </div>
      </div>
    </div>
  );
};

export default Profile;