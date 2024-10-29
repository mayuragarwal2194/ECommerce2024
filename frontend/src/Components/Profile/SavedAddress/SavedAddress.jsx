import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Ensure you have this import if you're using cookies
import { toast } from 'react-toastify';
import { API_URL } from '../../../services/api';

const SavedAddress = () => {
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const token = Cookies.get('authToken');

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_URL}/api/v1/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the headers
          },
        });

        const data = await response.json();

        // Check if deliveryInfo is available in the response
        if (data.deliveryInfo) {
          setDeliveryInfo(data.deliveryInfo);
        } else {
          toast.error('Delivery information not found.');
        }

      } catch (error) {
        console.error('Error fetching delivery info:', error);
        toast.error('Failed to load delivery information. Please try again later.');
      }
    };

    fetchDeliveryInfo();
  }, []); // Added API_URL to dependency array

  if (!deliveryInfo) {
    return <div>Loading delivery information...</div>; // Optional loading state
  }

  return (
    <>
      <h2 className='fw-bold mb-4'>My Saved Addresses</h2>
      <div className='profile-delivery-info d-block text-start'>
        <h3>Address</h3>
        <div className='d-flex gap-3'>
          <strong>{deliveryInfo.fullName}</strong>
          <strong>{deliveryInfo.mobileNumber.split('+91')[1]}</strong>
        </div>
        <div>
          {deliveryInfo.addressLine1}, {deliveryInfo.addressLine2}, {deliveryInfo.landmark}
        </div>
        <div>
          {deliveryInfo.townCity}, {deliveryInfo.state} - <strong>{deliveryInfo.pinCode}</strong>
        </div>
      </div>
    </>
  );
}

export default SavedAddress