// BuyNowButton.js
import React from 'react';

const BuyNowButton = () => {
  return (
    <div className="product-buy-now-btn w-100">
      <div
        role="button"
        aria-label="Buy Now"
        className="ff-btn ff-btn-fill-dark text-uppercase text-decoration-none d-inline-block w-75 text-center"
        tabIndex="0"
      >
        Buy Now
      </div>
    </div>
  );
};

export default BuyNowButton;