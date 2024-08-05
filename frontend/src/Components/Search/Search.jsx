// components/Search/Search.js

import React from 'react';

const Search = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search products..."
      className='px-3 py-1'
    />
  );
};

export default Search;