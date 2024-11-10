import React, { useEffect, useState } from 'react';
import './SavedAddress.css'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { API_URL } from '../../../services/api';
import DeliveryForm from '../../Delivery/DeliveryForm/DeliveryForm'; // Import DeliveryForm component

const SavedAddress = () => {
  const [deliveryInfo, setDeliveryInfo] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleEditClick = (address) => {
    setSelectedAddress(address); // Set the address to be edited
    setShowAddAddressForm(true);
  };


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
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.deliveryInfo) {
          setDeliveryInfo(data.deliveryInfo);
          setDefaultAddress(data.defaultAddress);
        } else {
          toast.error('Delivery information not found.');
        }
      } catch (error) {
        console.error('Error fetching delivery info:', error);
        toast.error('Failed to load delivery information. Please try again later.');
      }
    };

    fetchDeliveryInfo();
  }, []);

  const handleSetDefault = async (addressId) => {
    try {
      const token = Cookies.get('authToken');

      const response = await fetch(`${API_URL}/api/v1/delivery-info/set-default-address`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId }),
      });

      if (response.ok) {
        setDefaultAddress(addressId);
        toast.success('Default address updated successfully.');
      } else {
        throw new Error('Failed to set default address.');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address.');
    }
  };

  const openDeleteModal = (addressId) => {
    setAddressToDelete(addressId);

    // Show the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('deleteModal');
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  };

  const closeDeleteModal = () => {
    // Hide the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('deleteModal');
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  };


  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      const token = Cookies.get('authToken');

      const response = await fetch(`${API_URL}/api/v1/delivery-info/delete-address`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: addressToDelete }),
      });

      if (response.ok) {
        setDeliveryInfo(deliveryInfo.filter(address => address._id !== addressToDelete));

        if (defaultAddress === addressToDelete) {
          setDefaultAddress(deliveryInfo.length > 1 ? deliveryInfo[0]._id : null);
        }

        toast.success('Address deleted successfully.');
      } else {
        throw new Error('Failed to delete address.');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address.');
    } finally {
      closeDeleteModal();
    }
  };



  if (deliveryInfo.length === 0 && !showAddAddressForm) {
    return (
      <div>
        <p>No addresses saved.</p>
        <button onClick={() => setShowAddAddressForm(true)} className="ff-btn ff-btn-outline-dark text-decoration-none d-flex align-items-center gap-2 w-fit-content text-center mt-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={`18px`} fill="currentColor"><path d="M13.0001 10.9999L22.0002 10.9997L22.0002 12.9997L13.0001 12.9999L13.0001 21.9998L11.0001 21.9998L11.0001 12.9999L2.00004 13.0001L2 11.0001L11.0001 10.9999L11 2.00025L13 2.00024L13.0001 10.9999Z"></path></svg>
          <span>Add a New Address</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {!showAddAddressForm ? (
        <div>
          <div className="d-flex justify-content-between align-items-start">
            <h2 className='fw-bold mb-4'>My Saved Addresses</h2>
            <button onClick={() => setShowAddAddressForm(true)} className="ff-btn ff-btn-outline-dark text-decoration-none d-flex align-items-center gap-2 w-fit-content text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={`18px`} fill="currentColor"><path d="M13.0001 10.9999L22.0002 10.9997L22.0002 12.9997L13.0001 12.9999L13.0001 21.9998L11.0001 21.9998L11.0001 12.9999L2.00004 13.0001L2 11.0001L11.0001 10.9999L11 2.00025L13 2.00024L13.0001 10.9999Z"></path></svg>
              <span>Add a New Address</span>
            </button>
          </div>
          <p>
            {deliveryInfo.length} {deliveryInfo.length === 1 ? 'address' : 'addresses'}
          </p>
          {deliveryInfo.map((address) => (
            <div key={address._id}>
              <h3>{address._id === defaultAddress && 'Default Address'}</h3>
              <div className='profile-delivery-info d-block text-start w-75 mb-3'>
                <div className="d-flex align-items-center justify-content-between">
                  <div className='d-flex gap-3'>
                    <strong>{address.fullName}</strong>
                  </div>
                  <div className='d-flex gap-3'>
                    <button onClick={() => handleEditClick(address)} className='bg-transparent border-0 border-end border-dark pe-3 line-height-normal h-fit-content'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1.33398 14.6669H0.633984C0.633984 15.0535 0.947385 15.3669 1.33398 15.3669L1.33398 14.6669ZM14.6673 15.3669C15.0539 15.3669 15.3673 15.0535 15.3673 14.6669C15.3673 14.2803 15.0539 13.9669 14.6673 13.9669V15.3669ZM1.33398 11.3336L0.839009 10.8386C0.707734 10.9699 0.633984 11.1479 0.633984 11.3336H1.33398ZM10.3912 2.27634L9.8962 1.78137L9.8962 1.78137L10.3912 2.27634ZM12.2768 2.27634L11.7818 2.77132V2.77132L12.2768 2.27634ZM13.7245 3.72406L14.2195 3.22908V3.22908L13.7245 3.72406ZM13.7245 5.60967L13.2295 5.1147V5.1147L13.7245 5.60967ZM4.66732 14.6669L4.66732 15.3669C4.85297 15.3669 5.03102 15.2931 5.16229 15.1618L4.66732 14.6669ZM14.2814 4.40939L14.9471 4.19308L14.2814 4.40939ZM14.2814 4.92435L13.6156 4.70804V4.70804L14.2814 4.92435ZM11.0765 1.7195L10.8602 1.05376L11.0765 1.7195ZM11.5916 1.7195L11.8079 1.05376L11.5916 1.7195ZM8.49563 4.17191C8.22226 3.89854 7.77904 3.89854 7.50568 4.17191C7.23231 4.44528 7.23231 4.88849 7.50568 5.16186L8.49563 4.17191ZM10.839 8.49519C11.1124 8.76856 11.5556 8.76856 11.829 8.49519C12.1023 8.22183 12.1023 7.77861 11.829 7.50524L10.839 8.49519ZM1.33398 15.3669H14.6673V13.9669H1.33398V15.3669ZM2.03398 14.6669V11.3336H0.633984V14.6669H2.03398ZM1.82896 11.8285L10.8861 2.77132L9.8962 1.78137L0.839009 10.8386L1.82896 11.8285ZM11.7818 2.77132L13.2295 4.21903L14.2195 3.22908L12.7717 1.78137L11.7818 2.77132ZM13.2295 5.1147L4.17234 14.1719L5.16229 15.1618L14.2195 6.10465L13.2295 5.1147ZM4.66731 13.9669L1.33398 13.9669L1.33399 15.3669L4.66732 15.3669L4.66731 13.9669ZM13.2295 4.21903C13.4027 4.3922 13.5024 4.49271 13.5699 4.57215C13.632 4.64535 13.6247 4.65346 13.6156 4.6257L14.9471 4.19308C14.8763 3.97504 14.7555 3.80549 14.6371 3.6661C14.5241 3.53294 14.3763 3.38592 14.2195 3.22908L13.2295 4.21903ZM14.2195 6.10465C14.3763 5.94781 14.5241 5.80079 14.6372 5.66763C14.7555 5.52823 14.8763 5.35869 14.9471 5.14066L13.6156 4.70804C13.6247 4.68029 13.632 4.6884 13.5699 4.76159C13.5024 4.84102 13.4027 4.94153 13.2295 5.1147L14.2195 6.10465ZM13.6156 4.6257C13.6243 4.65248 13.6243 4.68126 13.6156 4.70804L14.9471 5.14066C15.0472 4.8327 15.0472 4.50103 14.9471 4.19308L13.6156 4.6257ZM10.8861 2.77132C11.0593 2.59815 11.1598 2.49842 11.2392 2.431C11.3124 2.36887 11.3205 2.37622 11.2928 2.38524L10.8602 1.05376C10.6422 1.12459 10.4726 1.24536 10.3332 1.3637C10.2001 1.47674 10.053 1.62452 9.8962 1.78137L10.8861 2.77132ZM12.7717 1.78137C12.6149 1.62456 12.4679 1.47677 12.3348 1.36375C12.1955 1.24541 12.0259 1.12461 11.8079 1.05376L11.3752 2.38524C11.3475 2.37621 11.3555 2.36882 11.4287 2.43095C11.5081 2.49839 11.6086 2.59811 11.7818 2.77132L12.7717 1.78137ZM11.2928 2.38524C11.3196 2.37654 11.3485 2.37654 11.3752 2.38524L11.8079 1.05376C11.4999 0.953695 11.1681 0.953695 10.8602 1.05376L11.2928 2.38524ZM7.50568 5.16186L10.839 8.49519L11.829 7.50524L8.49563 4.17191L7.50568 5.16186Z" fill="#221F20" fillOpacity="0.78"></path>
                      </svg>
                    </button>
                    <button onClick={() => openDeleteModal(address._id)} className='bg-transparent border-0 line-height-normal h-fit-content'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                        <path d="M9.66732 7.33333V13.1667M6.33398 7.33333L6.33398 13.1667M1.33398 4H14.6673M13.0007 4V13.8333C13.0007 14.7668 13.0008 15.2335 12.8192 15.59C12.6594 15.9036 12.4041 16.1585 12.0905 16.3183C11.734 16.5 11.2676 16.5 10.3341 16.5H5.66748C4.73406 16.5 4.267 16.5 3.91048 16.3183C3.59688 16.1585 3.3421 15.9036 3.18231 15.59C3.00065 15.2335 3.00065 14.7668 3.00065 13.8333V4H13.0007ZM11.334 4H4.66732C4.66732 3.22343 4.66732 2.83513 4.79418 2.52885C4.96334 2.12047 5.28758 1.79602 5.69596 1.62687C6.00225 1.5 6.39075 1.5 7.16732 1.5H8.83398C9.61055 1.5 9.99884 1.5 10.3051 1.62687C10.7135 1.79602 11.0379 2.12047 11.207 2.52885C11.3339 2.83513 11.334 3.22343 11.334 4Z" stroke="#221F20" strokeOpacity="0.78" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  {address.addressLine1},
                </div>
                <div>
                  {address.addressLine2},{address.landmark}
                </div>
                <div className='mb-3'>
                  {address.townCity}, {address.state} - <strong>{address.pinCode}</strong>
                </div>
                <div className='d-flex align-items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6.05785 1.97784C5.82162 1.38726 5.24963 1 4.61355 1H2.47368C1.65979 1 1 1.65982 1 2.47372C1 9.39182 6.60838 15 13.5265 15C14.3404 15 15 14.3403 15 13.5264L14.9999 11.3865C14.9999 10.7504 14.6126 10.1785 14.022 9.94223L11.9722 9.12226C11.4417 8.91006 10.8377 9.0057 10.3988 9.37148L9.86906 9.8128C9.251 10.3279 8.34221 10.2867 7.77331 9.71777L6.28217 8.22674C5.71328 7.65785 5.67228 6.74899 6.18734 6.13092L6.62863 5.60132C6.99441 5.16239 7.09002 4.55829 6.87782 4.02779L6.05785 1.97784Z" stroke="#221F20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className='fw-bold'>{address.mobileNumber.split('+91')[1]}</span>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    id={`defaultSwitch-${address._id}`}
                    checked={address._id === defaultAddress}
                    onChange={() => handleSetDefault(address._id)}
                  />
                  <label className="form-check-label cursor-pointer" htmlFor={`defaultSwitch-${address._id}`}>
                    {address._id === defaultAddress ? 'Default Address' : 'Set as Default'}
                  </label>
                </div>

              </div>
            </div>
          ))}
          <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeDeleteModal}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this address?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeDeleteModal}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={confirmDeleteAddress}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DeliveryForm
          initialAddressData={selectedAddress}
          onCancel={() => setShowAddAddressForm(false)}
        />
      )}
    </>
  );
};

export default SavedAddress;