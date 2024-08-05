import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';

const Breadcrum = ({ product }) => {
  return (
    <div className='breadcrum d-flex align-items-center gap-2 fw-500 text-capitalize'>
      Home <img src={arrow_icon} alt="Arrow icon" /> SHOP <img src={arrow_icon} alt="Arrow icon" /> {product.category.name} <img src={arrow_icon} alt="Arrow icon" /> {product.itemName}
    </div>
  );
};

export default Breadcrum;