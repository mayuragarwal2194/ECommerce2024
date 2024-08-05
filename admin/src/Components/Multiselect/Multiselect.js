import React, { useState, useEffect } from 'react';
import './MultiSelect.css'; // Ensure you have appropriate styling

const MultiSelect = ({ options, selectedOptions, setSelectedOptions }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedOptions(options);
    } else {
      setSelectedOptions([]);
    }
  };

  const isSelected = (option) => selectedOptions.includes(option);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.wrapper')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showDropdown]);

  return (
    <div className="wrapper">
      <button
        className="form-control toggle-next ellipsis"
        onClick={handleToggleDropdown}
      >
        {selectedOptions.length > 0
          ? `${selectedOptions.length} Sizes selected`
          : 'Select Sizes'}
      </button>

      {showDropdown && (
        <div className="checkboxes">
          <label className="apply-selection">
            <input
              type="checkbox"
              className="ckkBox all"
              checked={selectedOptions.length === options.length}
              onChange={handleSelectAll}
            />
            <span>All Sizes</span>
          </label>
          <div className="inner-wrap">
            {options.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={option}
                  className="ckkBox val"
                  checked={isSelected(option)}
                  onChange={handleOptionChange}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
