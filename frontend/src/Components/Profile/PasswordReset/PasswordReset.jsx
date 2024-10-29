import React, { useState } from 'react';
import './PasswordReset.css'
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../services/api';

const PasswordReset = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/api/v1/user/password-reset/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, confirmPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Password reset successfully') {
          setMessage('Password reset successful. You can now log in.');
          setError('');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError('Error resetting password. Please try again.');
        console.error('Error:', error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordValidation = {
    minLength: password.length >= 8,
    minLowercase: /[a-z]/.test(password),
    minUppercase: /[A-Z]/.test(password),
    minNumbers: /[0-9]/.test(password),
    minSymbols: /[^A-Za-z0-9]/.test(password),
  };

  return (
    <div className='password-reset-form w-25 m-auto border my-5 px-4 py-5'>
      <h2 className='text-center mt-0 mb-5'>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <div className='d-flex align-items-center justify-content-between flex-column gap-3 mb-5'>
          <div className='w-100'>
            <label htmlFor="password" className='d-block mb-1 form-label cursor-pointer user-select-none'>New Password:</label>
            <div className='position-relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='p-1 w-100'
              />
              <div className="show-hide-icons position-absolute" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <div className="hide-password-icon cursor-pointer d-inline-block" data-bs-toggle="tooltip" title="Hide Password">
                    {/* Hide Password SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path></svg>
                  </div>
                ) : (
                  <div className="show-password-icon cursor-pointer d-inline-block" data-bs-toggle="tooltip" title="Show Password">
                    {/* Show Password SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path></svg>
                  </div>
                )}
              </div>
            </div>
            {/* Validation list */}
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }} className='list-unstyled ps-0 user-select-none'>
              <li style={{ color: passwordValidation.minLength ? 'green' : 'red' }}>
                {passwordValidation.minLength ? (
                  <span style={{ color: 'green', marginRight: '5px' }}>✔</span>
                ) : (
                  <span style={{ color: 'red', marginRight: '5px' }}>✖</span>
                )}
                At least 8 characters
              </li>

              <li style={{ color: passwordValidation.minLowercase ? 'green' : 'red' }}>
                {passwordValidation.minLowercase ? (
                  <span style={{ color: 'green', marginRight: '5px' }}>✔</span>
                ) : (
                  <span style={{ color: 'red', marginRight: '5px' }}>✖</span>
                )}
                At least 1 lowercase letter
              </li>

              <li style={{ color: passwordValidation.minUppercase ? 'green' : 'red' }}>
                {passwordValidation.minUppercase ? (
                  <span style={{ color: 'green', marginRight: '5px' }}>✔</span>
                ) : (
                  <span style={{ color: 'red', marginRight: '5px' }}>✖</span>
                )}
                At least 1 uppercase letter
              </li>

              <li style={{ color: passwordValidation.minNumbers ? 'green' : 'red' }}>
                {passwordValidation.minNumbers ? (
                  <span style={{ color: 'green', marginRight: '5px' }}>✔</span>
                ) : (
                  <span style={{ color: 'red', marginRight: '5px' }}>✖</span>
                )}
                At least 1 number
              </li>

              <li style={{ color: passwordValidation.minSymbols ? 'green' : 'red' }}>
                {passwordValidation.minSymbols ? (
                  <span style={{ color: 'green', marginRight: '5px' }}>✔</span>
                ) : (
                  <span style={{ color: 'red', marginRight: '5px' }}>✖</span>
                )}
                At least 1 special character
              </li>
            </ul>
          </div>

          <div className='w-100'>
            <label htmlFor="confirmPassword" className='d-block mb-1 form-label cursor-pointer user-select-none'>Confirm New Password:</label>
            <div className='position-relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='p-1 w-100'
              />
              <div className="show-hide-icons position-absolute" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? (
                  <div className="hide-password-icon cursor-pointer d-inline-block" data-bs-toggle="tooltip" title="Hide Password">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path></svg>
                  </div>
                ) : (
                  <div className="show-password-icon cursor-pointer d-inline-block" data-bs-toggle="tooltip" title="Show Password">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path></svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='w-100 text-center'>
          <button type="submit" className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content user-select-none'>
            Reset Password
          </button>
        </div>
      </form>
      {message && <p className='mt-4'>{message}</p>}
      {error && <p style={{ color: 'red' }} className='mt-4'>{error}</p>}
    </div>
  );
};

export default PasswordReset;