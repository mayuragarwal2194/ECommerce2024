// Filter.jsx
import React, { useState } from 'react';

const Filter = ({ filterOptions, onApplyFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (option, value, checked) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        if (!updatedFilters[option]) {
          updatedFilters[option] = [];
        }
        updatedFilters[option].push(value);
      } else {
        updatedFilters[option] = updatedFilters[option].filter((v) => v !== value);
      }
      return updatedFilters;
    });
  };

  return (
    <div>
      {filterOptions.map((option) => (
        <div key={option.label}>
          <h5>{option.label}</h5>
          {option.values.map((value) => (
            <div key={value}>
              <label>
                <input
                  type="checkbox"
                  value={value}
                  onChange={(e) => handleFilterChange(option.label, value, e.target.checked)}
                />
                {value}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => onApplyFilters(selectedFilters)}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;