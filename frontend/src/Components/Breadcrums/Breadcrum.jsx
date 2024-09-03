import React from 'react';
import './Breadcrum.css';

const Breadcrum = ({ product }) => {
  return (
    <div className='breadcrum d-flex align-items-center gap-2 fw-500 text-capitalize'>
      Home <i className="ri-arrow-right-s-line"></i> SHOP <i className="ri-arrow-right-s-line"></i> {product.category.name} <i className="ri-arrow-right-s-line"></i> {product.itemName}
    </div>
  );
};

export default Breadcrum;