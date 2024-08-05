import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className="container my-5">
      <div className='newsletter d-flex flex-column align-items-center justify-content-center m-auto w-100 py-5'>
        <div className="section-head text-center mb-5">
          <h1 className='text-capitalize fw-700'>Get exclusive offers on your email</h1>
          <p className='mt-4 mb-0'>Subscribe to our newsletter and stay updated</p>
          {/* <div className="section-head-underline m-auto"></div> */}
        </div>
        <div className='input-wrapper d-flex align-items-center justify-content-between bg-white rounded-pill ps-4'>
          <input type="email" placeholder='Your Email Id' className='border-0 outline-0 w-75 pe-4' />
          <button className='bg-dark rounded-pill w-25 text-white py-3 cursor-pointer'>Subscribe</button>
        </div>
      </div>
    </div>
  )
}

export default NewsLetter