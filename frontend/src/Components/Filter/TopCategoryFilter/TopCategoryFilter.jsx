import React from 'react';

const TopCategoryFilter = ({ categories, selectedFilters, onCheckboxChange }) => (
  <div className="mb-4">
    <h4 className='border-bottom pb-2'>Categories</h4>
    {categories.map((category) => (
      <div key={category._id} className="filter-item d-flex align-items-center gap-2">
        <input
          type="checkbox"
          id={`topCategory-${category._id}`}
          checked={selectedFilters.includes(category._id)}
          onChange={() => onCheckboxChange('topCategories', category._id)}
        />
        <label
          htmlFor={`topCategory-${category._id}`}
          className="text-capitalize cursor-pointer user-select-none"
        >
          {category.name}
        </label>
      </div>
    ))}
  </div>
);

export default TopCategoryFilter;