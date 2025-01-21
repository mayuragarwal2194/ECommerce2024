import React, { useEffect, useState } from 'react';

const SortBy = ({ selectedSort, onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  // Sync local state with the prop value whenever it changes
  useEffect(() => {
    setSelectedOption(selectedSort);
  }, [selectedSort]);

  const handleSortChange = (e) => {
    const { value } = e.target;
    setSelectedOption(value);
    onSortChange(value);
  };

  return (
    <div className="mb-4 sort-by-filter">
      <h4>Sort By</h4>
      <label htmlFor="sort-by-select" className="form-label">Select Sorting Option:</label>
      <select
        id="sort-by-select"
        className="form-select"
        value={selectedOption}
        onChange={handleSortChange}
      >
        <option value="">Select</option>
        <option value="alphabetically-asc">Alphabetically A-Z</option>
        <option value="alphabetically-desc">Alphabetically Z-A</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="price-asc">Price: Low to High</option>
      </select>
    </div>
  );
};

export default SortBy;