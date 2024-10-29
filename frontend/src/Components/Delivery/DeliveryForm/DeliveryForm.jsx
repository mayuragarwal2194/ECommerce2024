import React, { useState, useEffect } from 'react';
import { customFetch } from '../../Utils/apiClient';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import PhoneVerification from '../PhoneVerification/PhoneVerification';
import { fetchCountries, fetchStatesByCountry, fetchCitiesByState, fetchDeliveryInfo } from '../../../services/api'; // Import API functions

const DeliveryForm = () => {
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    townCity: '',
    fullName: '',
    mobileNumber: '',  // Ensure this is part of the initial state
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pinCode: '',
  });

  const [mobileVerified, setMobileVerified] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const token = Cookies.get('authToken');

  // Fetch delivery info and set it in formData
  useEffect(() => {
    const loadDeliveryInfo = async () => {
      try {
        const info = await fetchDeliveryInfo(token);
        // Set formData with fetched delivery info if it exists
        if (info) {
          setFormData({
            country: info.country,
            state: info.state,
            townCity: info.townCity,
            fullName: info.fullName,
            mobileNumber: info.mobileNumber,
            addressLine1: info.addressLine1,
            addressLine2: info.addressLine2,
            landmark: info.landmark,
            pinCode: info.pinCode,
          });
        }
      } catch (error) {
        console.error('Error loading delivery info:', error);
      }
    };

    loadDeliveryInfo(); // Call the function to fetch delivery info on component mount
  }, [token]);

  // Fetch countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    };
    loadCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    const loadStates = async () => {
      if (formData.country) {
        const statesData = await fetchStatesByCountry(formData.country);
        setStates(statesData);
        setCities([]); // Reset cities when country changes
      }
    };
    loadStates();
  }, [formData.country]);

  // Fetch cities when a state is selected
  useEffect(() => {
    const loadCities = async () => {
      if (formData.state && formData.country) {
        console.log('Fetching cities for Country:', formData.country, 'State:', formData.state); // Debugging line
        const citiesData = await fetchCitiesByState(formData.country, formData.state);
        setCities(citiesData);
      }
    };
    loadCities();
  }, [formData.state, formData.country]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobileVerified) {
      toast.error('Please verify your mobile number before submitting the form.');
      return;
    }

    try {
      const response = await customFetch('/api/v1/delivery-info', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          isVerified: mobileVerified,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Delivery information saved successfully!');
      } else {
        toast.error('Failed to save delivery information.');
      }
    } catch (error) {
      console.error('Error submitting delivery information:', error);
      toast.error('An error occurred while saving delivery info.');
    }
  };

  return (
    <div className="delivery-form">
      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-4 mb-4">
          <div className='w-50'>
            <label htmlFor='country' className="cursor-pointer d-block mb-1">Country:</label>
            <select name="country" id='country' value={formData.country} onChange={handleInputChange} className='px-2 py-1 w-100' autoComplete='true' required>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className='w-50'>
            <label htmlFor='state' className="cursor-pointer d-block mb-1">State:</label>
            <select name="state" id='state' value={formData.state} onChange={handleInputChange} className='px-2 py-1 w-100' autoComplete='true' required>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex gap-4 mb-4">
          <div className='w-50'>
            <label htmlFor='townCity' className="cursor-pointer d-block mb-1">Town/City:</label>
            <select className='px-2 py-1 w-100' name="townCity" id='townCity' value={formData.townCity} onChange={handleInputChange} required>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className='w-50'>
            <label htmlFor='fullName' className="cursor-pointer d-block mb-1">Full Name:</label>
            <input
              type="text"
              className='px-2 py-1 w-100'
              name="fullName"
              id='fullName'
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className='w-50 pe-3'>
          <label htmlFor="mobileNumber" className="cursor-pointer d-block mb-1">Mobile Number:</label>
          <input
            type="text"
            className='px-2 py-1 w-100'
            name="mobileNumber"
            id="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Include PhoneVerification Component */}
        <PhoneVerification
          mobileNumber={formData.mobileNumber} // Pass mobile number to PhoneVerification
          onVerificationComplete={(verified) => {
            setMobileVerified(verified);
            if (verified) toast.success('Mobile number verified successfully!');
          }}
        />

        <div className="d-flex gap-4 mb-4">
          <div className='w-50'>
            <label htmlFor="addressLine1" className="cursor-pointer d-block mb-1">Flat, House No., Building, Company, Apartment:</label>
            <input
              type="text"
              className='px-2 py-1 w-100'
              id='addressLine1'
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='w-50'>
            <label htmlFor="addressLine2" className="cursor-pointer d-block mb-1">
              Area, Street, Sector, Village:
            </label>
            <input
              type="text"
              className='px-2 py-1 w-100'
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="d-flex gap-4 mb-4">
          <div className='w-50'>
            <label htmlFor="landmark" className="cursor-pointer d-block mb-1">Landmark:</label>
            <input
              type="text"
              className='px-2 py-1 w-100'
              name="landmark"
              id="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
            />
          </div>

          <div className='w-50'>
            <label htmlFor="pinCode" className="cursor-pointer d-block mb-1">Pin Code:</label>
            <input
              type="text"
              className='px-2 py-1 w-100'
              name="pinCode"
              id="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="w-100 text-center mt-5">
          <button type="submit" className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content'>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;