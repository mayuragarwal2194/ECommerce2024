// ProductQuantity.js
import React from 'react';

const ProductQuantity = ({ quantity }) => {
  return (
    <div className="product-quantity">
      {quantity > 0 ? (
        <p className="mb-0 text-success">{quantity} items available</p>
      ) : (
        <p className="out-of-stock mb-0 text-danger">Out of stock</p>
      )}
    </div>
  );
};

export default ProductQuantity;
