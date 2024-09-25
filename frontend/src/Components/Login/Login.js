// src/components/auth/Login.js
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { handleLogin } from '../../services/api'; // Adjust the path based on your structure
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await handleLogin(email, password);
      Cookies.set('authToken', token, { expires: 7 }); // Store token in cookies for 7 days
      console.log('Login successful, token:', token);

      // Redirect to a protected route, e.g., the profile page(In our case we are redirectiong to home page first)
      window.location.href = '/';

    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-form my-5 border w-fit-content m-auto py-4 px-4 rounded">
      <h2 className='text-center mt-0'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='d-flex flex-column gap-4 mb-5'>
          <div className="mb-3">
            <label htmlFor="useremail" className="form-label cursor-pointer user-select-none">Email address</label>
            <input type="email" className="form-control" value={email}
              id='useremail'
              name='useremail'
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="useremail" />
            <div id="useremail" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label cursor-pointer user-select-none">Password</label>
            <input type="password" className="form-control" id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='true' />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content m-auto'>Login</button>
        </div>
      </form>
      <p className='text-center mb-0'>
        Don't have an account ?
        <Link to={'/signup'}> Sign up </Link>
      </p>
    </div>
  );
};

export default Login;