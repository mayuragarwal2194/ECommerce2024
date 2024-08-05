// ViewProducts.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewProducts.css'; // Custom CSS for the modal
import Filter from '../Filter/Filter';
import Search from '../Search/Search';
import ProductTable from '../ProductTable/ProductTable';

const ViewProducts = ({ products, fetchProducts, categories }) => {
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // const filterOptions = [
  //   {
  //     label: 'Category',
  //     values: categories.map(category => category.name),
  //   },
  //   // Add more filter options if needed
  // ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const searchedProducts = products.filter((prod) =>
      prod.itemName.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(searchedProducts);
  }, [searchQuery, products]);

  const handleEdit = (prod) => {
    navigate(`/admin/edit/${prod._id}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProducts();
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const handleApplyFilters = (selectedFilters) => {
    const filtered = products.filter((prod) => {
      return Object.keys(selectedFilters).every((key) => {
        if (selectedFilters[key].length === 0) return true;
        return selectedFilters[key].includes(prod[key.toLowerCase()]);
      });
    });

    setFilteredProducts(filtered);
    setShowFilterModal(false);
  };

  return (
    <div className="w-100">
      <h2 className="mb-4">View Products</h2>
      <div className="d-flex align-items-center gap-5 me-5 pe-5 mb-3">
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button className="border-0 bg-transparent" onClick={toggleFilterModal}>
          Filter <i className="ri-filter-3-line"></i>
        </button>
      </div>
      <ProductTable
        products={filteredProducts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* {showFilterModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Filter Products</h5>
              <button type="button" className="close" onClick={toggleFilterModal}>&times;</button>
            </div>
            <div className="modal-body">
              <Filter filterOptions={filterOptions} onApplyFilters={handleApplyFilters} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={toggleFilterModal}>Close</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ViewProducts;