import React, { useEffect, useState } from 'react';
import {
  fetchTopCategories,
  getAllSizes,
  getAllProducts,
} from '../../services/api';
import TopCategoryFilter from './TopCategoryFilter/TopCategoryFilter';
import SizeFilter from './SizeFilter/SizeFilter';
import ColorFilter from './ColorFilter/ColorFilter';
import PriceFilter from './PriceFilter/PriceFilter'; // Import the PriceFilter
import './Filter.css';
import SortBy from './SortBy/SortBy';

const Filter = ({ filters, onApplyFilter }) => {
  const [topCategories, setTopCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    ...filters,
    priceRange: filters.priceRange || { min: 0, max: 30000 }, // Default price range
  });
  const [selectedSort, setSelectedSort] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [top, allSizes, products] = await Promise.all([
          fetchTopCategories(),
          getAllSizes(),
          getAllProducts(),
        ]);

        setTopCategories(top);
        setSizes(allSizes);

        // Extract unique colors
        const uniqueColors = [];
        products.forEach((product) => {
          product.variants.forEach((variant) => {
            if (!uniqueColors.includes(variant.attributes.color)) {
              uniqueColors.push(variant.attributes.color);
            }
          });
        });

        setColors(uniqueColors.map((color) => ({ _id: color, name: color })));
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleCheckboxChange = (filterType, id) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = [...prevFilters[filterType]];
      if (updatedFilters.includes(id)) {
        return {
          ...prevFilters,
          [filterType]: updatedFilters.filter((filterId) => filterId !== id),
        };
      } else {
        updatedFilters.push(id);
        return { ...prevFilters, [filterType]: updatedFilters };
      }
    });
  };

  const handlePriceChange = (newPriceRange) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newPriceRange,
      sortBy: selectedSort
    }));
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
    const updatedFilters = { ...selectedFilters, sortBy: sortOption };
    onApplyFilter(updatedFilters); // Apply the updated filters immediately
  };


  const handleApplyFilter = () => {
    onApplyFilter(selectedFilters);
  };

  return (
    <div className="filter-component">
      <SortBy selectedSort={filters.sortBy} onSortChange={handleSortChange} />
      <TopCategoryFilter
        categories={topCategories}
        selectedFilters={selectedFilters.topCategories}
        onCheckboxChange={handleCheckboxChange}
      />
      <SizeFilter
        sizes={sizes}
        selectedFilters={selectedFilters.sizes}
        onCheckboxChange={handleCheckboxChange}
      />
      <ColorFilter
        colors={colors}
        selectedFilters={selectedFilters.colors}
        onCheckboxChange={handleCheckboxChange}
      />
      <PriceFilter
        minPrice={selectedFilters.priceRange.min}
        maxPrice={selectedFilters.priceRange.max}
        onPriceChange={handlePriceChange}
      />
      <button className="ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content mt-3" onClick={handleApplyFilter}>
        Apply Filter
      </button>
    </div>
  );
};

export default Filter;