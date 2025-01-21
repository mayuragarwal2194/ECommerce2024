import React, { useEffect, useState, useRef } from 'react';
import { debounce } from 'lodash';
import './PriceFilter.css';

const PriceFilter = ({ minPrice = 0, maxPrice = 30000, onPriceChange }) => {
  const [priceRange, setPriceRange] = useState({
    min: minPrice,
    max: maxPrice,
  });
  const [sliderValues, setSliderValues] = useState({
    min: minPrice,
    max: maxPrice,
  });
  const [error, setError] = useState({ min: '', max: '' });

  // Keep track of `onPriceChange` with a ref to prevent re-renders
  const onPriceChangeRef = useRef(onPriceChange);

  useEffect(() => {
    const debouncedCallback = debounce(onPriceChange, 300);
    onPriceChangeRef.current = debouncedCallback;
    return () => debouncedCallback.cancel();
  }, [onPriceChange]);

  useEffect(() => {
    setPriceRange({ min: minPrice, max: maxPrice });
    setSliderValues({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  useEffect(() => {
    onPriceChangeRef.current(priceRange);
  }, [priceRange]);

  const validateInput = (name, value) => {
    const numericValue = Number(value);

    if (numericValue < 0) {
      setError((prev) => ({ ...prev, [name]: 'Value cannot be negative.' }));
      return 0;
    }

    if (name === 'min' && numericValue > priceRange.max) {
      setError((prev) => ({ ...prev, [name]: 'Min cannot exceed Max.' }));
      return priceRange.max;
    }

    if (name === 'max' && numericValue < priceRange.min) {
      setError((prev) => ({ ...prev, [name]: 'Max cannot be less than Min.' }));
      return priceRange.min;
    }

    setError((prev) => ({ ...prev, [name]: '' }));
    return numericValue;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPriceRange((prev) => {
      const correctedValue = validateInput(name, value);
      return { ...prev, [name]: correctedValue };
    });
    setSliderValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    setSliderValues((prev) => ({
      ...prev,
      [name]: numericValue,
    }));

    // Update `priceRange` after ensuring constraints
    setPriceRange((prev) => {
      const updatedRange = { ...prev, [name]: numericValue };

      if (updatedRange.min > updatedRange.max) {
        if (name === 'min') updatedRange.max = numericValue;
        else updatedRange.min = numericValue;
      }

      return updatedRange;
    });
  };

  return (
    <div className="mb-4 price-filter">
      <h4 className="border-bottom pb-2">Price Range</h4>
      <div className="price-inputs d-flex gap-2">
        <div>
          <label htmlFor="min-price" className="form-label">Min</label>
          <input
            type="number"
            id="min-price"
            name="min"
            className={`form-control ${error.min ? 'is-invalid' : ''}`}
            value={priceRange.min}
            onChange={handleInputChange}
            min="0"
            max={priceRange.max}
          />
          {error.min && <div className="invalid-feedback">{error.min}</div>}
        </div>
        <div>
          <label htmlFor="max-price" className="form-label">Max</label>
          <input
            type="number"
            id="max-price"
            name="max"
            className={`form-control ${error.max ? 'is-invalid' : ''}`}
            value={priceRange.max}
            onChange={handleInputChange}
            min={priceRange.min}
            max="30000"
          />
          {error.max && <div className="invalid-feedback">{error.max}</div>}
        </div>
      </div>
      <div className="sliders_control position-relative mt-4">
        <input
          type="range"
          id="fromSlider"
          name="min"
          min="0"
          max="30000"
          value={sliderValues.min}
          onChange={handleSliderChange}
          style={{
            zIndex: sliderValues.min === priceRange.max ? 2 : 'auto',
          }}
        />
        <input
          type="range"
          id="toSlider"
          name="max"
          min="0"
          max="30000"
          value={sliderValues.max}
          onChange={handleSliderChange}
          style={{
            zIndex: sliderValues.max === priceRange.min ? 2 : 'auto',
          }}
        />
      </div>
      <div className="price-display mt-5">
        <span>₹{priceRange.min}</span> - <span>₹{priceRange.max}</span>
      </div>
    </div>
  );
};

export default PriceFilter;