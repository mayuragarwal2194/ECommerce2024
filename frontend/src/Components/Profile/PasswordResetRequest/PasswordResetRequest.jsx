import React, { useState } from 'react';
import { API_URL } from '../../../services/api';
import Cookies from 'js-cookie'; 

const PasswordResetRequest = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestSubmit = (e) => {
    e.preventDefault();

    // Get the token from localStorage (or wherever you store it)
    const token = Cookies.get('authToken');

    // Make the API request for password reset
    fetch(`${API_URL}/api/v1/user/password-reset-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include token in request headers
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setError('');
        } else {
          setError('Error requesting password reset. Please try again.');
        }
      })
      .catch((error) => {
        setError('Error requesting password reset. Please try again.');
        console.error('Error:', error);
      });
  };

  return (
    <div className="password-reset-request">
      <form onSubmit={handleRequestSubmit}>
        <button type="submit" className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content'>Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PasswordResetRequest;