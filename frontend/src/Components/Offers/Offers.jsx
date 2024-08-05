import React from 'react';
import './Offers.css';
import exclusive_image from '../Assets/exclusive_image.png';

const Offers = () => {
  return (
    <div className="container">
      <div className='offers d-flex align-items-center justify-content-around px-5'>
        <div className="offers-left d-flex justify-content-center flex-column flex-1">
          <h1>Exclusive</h1>
          <h1>Offers For You</h1>
          <p className='text-uppercase'>Only on best sellers products</p>
          <button className='rounded-pill text-white w-fit-content py-2 px-4 fw-500 mt-3 cursor-pointer'>Check Now</button>
        </div>
        <div className="offers-right flex-1 d-flex align-items-center justify-content-end">
          <img src={exclusive_image} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Offers