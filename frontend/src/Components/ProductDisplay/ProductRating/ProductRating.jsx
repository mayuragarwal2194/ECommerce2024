// ProductRating.js
import React from 'react';

const ProductRating = ({ averageRating }) => {
  return (
    <div className="productdisplay-stars d-flex align-items-center gap-2">
      <div className="d-flex align-items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <i
            key={index}
            className={`ri-star${index < Math.floor(averageRating) ? '-fill' : index < averageRating ? '-half-fill' : '-line'}`}
          ></i>
        ))}
      </div>
      <p className="mb-0">({averageRating})</p>
    </div>
  );
};

export default ProductRating;