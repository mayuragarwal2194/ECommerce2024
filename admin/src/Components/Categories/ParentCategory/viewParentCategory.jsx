import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getParentCategories } from '../../../Services/api';

const ViewParentCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    try {
      const data = await getParentCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  };

  const handleEdit = (category) => {
    navigate(`/parentcategories/add`, { state: { category, isEditMode: true } });
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:5000/parentcategories/${categoryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Category deleted successfully');
          fetchParentCategories();
        } else {
          alert('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">View Parent Categories</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Active</th>
              <th>Show in Navbar</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.isActive ? 'Yes' : 'No'}</td>
                <td>{category.showInNavbar ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewParentCategory;