// ProductColors.js
import React from 'react';

const ProductColors = ({ 
  colorOptions, 
  selectedColor, 
  onColorSelect 
}) => {
  return (
    <div className="productdisplay-color">
      <div className="selected-color-name mb-2">
        <span>
          Color: <span>{selectedColor}</span>
        </span>
      </div>
      <ul className="color-options mb-0 list-unstyled d-flex flex-wrap align-items-center gap-3">
        {colorOptions.map((colorOption, index) => (
          <li
            key={index}
            className={`color-option cursor-pointer ${selectedColor === colorOption.color ? 'selected' : ''}`}
            style={{
              backgroundImage: `url(${colorOption.image})`,
            }}
            onClick={() => onColorSelect(colorOption.color)}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default ProductColors;