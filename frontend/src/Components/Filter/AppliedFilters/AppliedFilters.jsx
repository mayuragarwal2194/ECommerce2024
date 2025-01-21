import React, { useEffect, useState } from 'react';
import { fetchTopCategories, getAllSizes } from '../../../services/api'; // Adjust the import path if needed

const AppliedFilters = ({ filters, onRemoveFilter }) => {
  const [topCategoryNames, setTopCategoryNames] = useState({}); // Map of ID to Name
  const [sizeNames, setSizeNames] = useState({}); // Map of Size ID to Size Name

  // Fetch top categories and sizes on component mount
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        // Fetch top categories and sizes in parallel
        const [categories, sizes] = await Promise.all([fetchTopCategories(), getAllSizes()]);

        // Build mapping for top categories
        const categoryMap = categories.reduce((acc, category) => {
          acc[category._id] = category.name;
          return acc;
        }, {});

        setTopCategoryNames(categoryMap);

        // Build mapping for sizes
        const sizeMap = sizes.reduce((acc, size) => {
          acc[size._id] = size.sizeName;
          return acc;
        }, {});

        setSizeNames(sizeMap);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    loadFiltersData();
  }, []);

  const renderFilterChips = () => {
    const chips = [];

    // Render top category chips
    if (filters.topCategories.length > 0) {
      filters.topCategories.forEach((categoryId) => {
        const categoryName = topCategoryNames[categoryId] || categoryId; // Use ID if name not found
        chips.push({
          label: `Top Category: ${categoryName}`,
          key: `topCategories-${categoryId}`,
        });
      });
    }

    // Render size chips
    if (filters.sizes.length > 0) {
      filters.sizes.forEach((sizeId) => {
        const sizeName = sizeNames[sizeId] || sizeId; // Use ID if name not found
        chips.push({
          label: `Size: ${sizeName}`,
          key: `sizes-${sizeId}`,
        });
      });
    }

    if (filters.colors.length > 0) {
      filters.colors.forEach((color) =>
        chips.push({ label: `Color: ${color}`, key: `colors-${color}` })
      );
    }

    // Only show price range if it differs from the default range
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (!(min === 0 && max === 30000)) {
        chips.push({ label: `Price: ₹${min} - ₹${max}`, key: 'priceRange' });
      }
    }

    if (filters.sortBy) {
      const sortLabel = {
        'alphabetically-asc': 'Alphabetically A-Z',
        'alphabetically-desc': 'Alphabetically Z-A',
        'price-asc': 'Price Low to High',
        'price-desc': 'Price High to Low',
      }[filters.sortBy];

      if (sortLabel) {
        chips.push({ label: `Sort: ${sortLabel}`, key: 'sortBy' });
      }
    }

    return chips;
  };

  const appliedChips = renderFilterChips();

  return (
    <div className="applied-filters d-flex align-items-center gap-3">
      {appliedChips.map((chip) => (
        <div
          key={chip.key}
          className="filter-chip cursor-pointer user-select-none border rounded-pill px-3 py-1"
          onClick={() => onRemoveFilter(chip.key)}
          title='remove'
        >
          <span>{chip.label}</span>
          <i className="ri-close-line"></i>
        </div>
      ))}
    </div>
  );
};

export default AppliedFilters;