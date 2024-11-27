// ProductPrice.js
import React from 'react';

const ProductPrice = ({ newPrice, oldPrice, discount }) => {
  return (
    <div className="product-prices d-flex align-items-center gap-4">
      <div className="current-price fw-600">${newPrice}</div>
      <div className="old-price text-decoration-line-through">${oldPrice}</div>
      <span className="product-discount">({discount}% OFF)</span>
    </div>
  );
};

export default ProductPrice;
