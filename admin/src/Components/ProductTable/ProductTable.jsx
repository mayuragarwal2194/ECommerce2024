import React, { useState, useEffect } from 'react';

// Function to fetch parent category details by ID
const fetchParentCategoryById = async (parentId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/parentcategories/${parentId}`);
    const parent = await response.json();
    return parent.name; // Adjust based on your actual API response
  } catch (error) {
    console.error('Error fetching parent category:', error);
    return 'Unknown Category';
  }
};

const ProductTable = ({ products, handleEdit, handleDelete }) => {
  const [parentCategoryNames, setParentCategoryNames] = useState({});

  useEffect(() => {
    const fetchParentCategories = async () => {
      const parentNames = {};
      for (const prod of products) {
        if (prod.category.parent) {
          const parentId = prod.category.parent; // Adjust this if needed
          if (!parentNames[parentId]) {
            const name = await fetchParentCategoryById(parentId);
            parentNames[parentId] = name;
          }
        }
      }
      setParentCategoryNames(parentNames);
    };

    fetchParentCategories();
  }, [products]);

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Product Image</th>
            <th>New Price</th>
            <th>Old Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} className='vertical-align-middle'>
              <td>{prod.id}</td>
              <td>{prod.itemName}</td>
              <td>
                {prod.featuredImage && (
                  <img
                    src={`http://localhost:5000/uploads/featured/${prod.featuredImage}`}
                    alt={prod.itemName}
                    className='item-image object-cover object-top'
                    width={'50px'}
                    height={'50px'}
                  />
                )}
              </td>
              <td>${prod.newPrice}</td>
              <td>${prod.oldPrice}</td>
              <td>
                {prod.category.name} 
                {prod.category.parent && (
                  <span> ({parentCategoryNames[prod.category.parent] || 'Loading...'})</span>
                )}
              </td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(prod)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;