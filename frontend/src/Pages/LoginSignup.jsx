import React from 'react'
import './CSS/LoginSignup.css'
import BTN_FILL_RED from '../Components/Buttons/BtnFillRed/Btn_Fill_Red'

const LoginSignup = () => {
  return (
    <div className='loginsignup w-100 mb-5 py-5'>
      <div className="container">
        <div className="loginsignup-wrapper bg-white d-flex align-items-center flex-column w-fit-content m-auto p-5 gap-4">
          <div className="section-head text-center mb-4">
            <h1 className='text-capitalize fw-700 mb-0'>Sign Up</h1>
          </div>
          <div className="loginsignup-fields d-flex align-items-center flex-column gap-4 w-100 mb-4">
            <input type="text" placeholder='Your Name' className='w-75 px-3 py-2 w-100 rounded' />
            <input type="email" placeholder='Email Address' className='w-75 px-3 py-2 w-100 rounded' />
            <input type="password" placeholder='Password' className='w-75 px-3 py-2 w-100 rounded' />
          </div>
          <BTN_FILL_RED btn_name={`Sign Up`} />
          <p className="loginsignup-login mb-0">
            Already have an account? <span className='fw-600'>Login Here</span>
          </p>
          <div className="loginsignup-agree">
            <label htmlFor="loginsignup-agree" className='cursor-pointer d-flex align-items-center gap-2 fw-500 user-select-none'>
              <input type="checkbox" name='' id='loginsignup-agree' />
              <p className='mb-0'>By continuing, i agree to the terms of use & privacy policy </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup