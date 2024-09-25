// src/components/auth/SignUp.js
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { handleSignUp } from '../../services/api'; // Adjust the path based on your structure
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await handleSignUp(username, email, password);
      Cookies.set('authToken', token, { expires: 7 }); // Store token in cookies for 7 days
      console.log('Signup successful, token:', token);

      // Redirect to a protected route, e.g., the profile page (In our case, we are redirecting to the home page first)
      window.location.href = '/';
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="signup-form my-5 border w-fit-content m-auto py-4 px-4 rounded">
      <h2 className='text-center mt-0'>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className='d-flex flex-column gap-4 mb-5'>
          <div className="mb-3">
            <label htmlFor="username" className="form-label cursor-pointer user-select-none">Username</label>
            <input
              type="text"
              className="form-control"
              id='username'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete='true'
            />
          </div>
          <div className="mb-3">
            <label htmlFor="userEmail" className="form-label cursor-pointer user-select-none">Email address</label>
            <input
              type="email"
              className="form-control"
              id='userEmail'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='true'
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label cursor-pointer user-select-none">Password</label>
            <input
              type="password"
              className="form-control"
              id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='true'
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content m-auto'>Sign Up</button>
        </div>
      </form>
      <p className='text-center mb-0'>
        Already have an account?
        <Link to={'/login'}> Login </Link>
      </p>
    </div>
  );
};

export default SignUp;