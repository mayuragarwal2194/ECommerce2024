// ProductSizes.js
import React from 'react';

const ProductSizes = ({ 
  availableSizes, 
  selectedSize, 
  sizeStock, 
  sizeIdMap, 
  onSizeSelect 
}) => {
  return (
    <div className="productdisplay-size">
      <ul className="product-sizes mb-0 list-unstyled d-flex align-items-center gap-3">
        {availableSizes.map((size, index) => {
          // Map the size to its ID and check stock
          const sizeId = Object.keys(sizeStock).find((id) => sizeIdMap[id] === size);
          const isOutOfStock = sizeStock[sizeId] === 0;

          return (
            <li
              key={index}
              className={`size-option ${selectedSize === size ? 'selected' : ''} cursor-pointer d-flex align-items-center justify-content-center ${isOutOfStock ? 'out-of-stock' : ''}`}
              onClick={() => onSizeSelect(size)}
              style={{ opacity: isOutOfStock ? 0.5 : 1 }}
            >
              {size}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProductSizes;
