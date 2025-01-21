import React from 'react';

const ColorFilter = ({ colors, selectedFilters, onCheckboxChange }) => (
  <div className="mb-4">
    <h4 className='border-bottom pb-2'>Colors</h4>
    {colors.map((color) => (
      <div key={color._id} className="filter-item d-flex align-items-center gap-2">
        <input
          type="checkbox"
          id={`color-${color._id}`}
          checked={selectedFilters.includes(color._id)}
          onChange={() => onCheckboxChange('colors', color._id)}
        />
        <label
          htmlFor={`color-${color._id}`}
          className="text-capitalize cursor-pointer user-select-none"
        >
          {color.name}
        </label>
      </div>
    ))}
  </div>
);

export default ColorFilter;