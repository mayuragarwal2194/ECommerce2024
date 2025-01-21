import React from 'react';

const SizeFilter = ({ sizes, selectedFilters, onCheckboxChange }) => (
  <div className="mb-4">
    <h4 className='border-bottom pb-2'>Sizes</h4>
    {sizes.map((size) => (
      <div key={size._id} className="filter-item d-flex align-items-center gap-2">
        <input
          type="checkbox"
          id={`size-${size._id}`}
          checked={selectedFilters.includes(size._id)}
          onChange={() => onCheckboxChange('sizes', size._id)}
        />
        <label
          htmlFor={`size-${size._id}`}
          className="text-capitalize cursor-pointer user-select-none"
        >
          {size.sizeName}
        </label>
      </div>
    ))}
  </div>
);

export default SizeFilter;