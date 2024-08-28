import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../Services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewChildCategory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (message) {
      toast.success(message);

      // Clear the message from history state after showing the toast
      navigate(location.pathname, { replace: true });
    }
  }, [message, navigate, location.pathname]);

  useEffect(() => {
    fetchChildCategories();
  }, []);

  const fetchChildCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/childcategories`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
        console.log(data);
        
      } else {
        console.error('Failed to fetch child categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching child categories:', error);
    }
  };

  const handleEdit = (category) => {
    navigate(`/childcategories/add`, { state: { category, isEditMode: true } });
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${API_URL}/api/v1/childcategories/${categoryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Category deleted successfully');
          fetchChildCategories();
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">View Child Categories</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent Category</th>
              <th>Mega Menu</th>
              <th>Show in Navbar</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>
                  {category.parent?.name || 'N/A'}
                </td>
                <td>{category.megaMenu ? 'Yes' : 'No'}</td>
                <td>{category.showInNavbar ? 'Yes' : 'No'}</td>
                <td>
                  {category.childImage ? (
                    <img
                      src={`${API_URL}/${category.childImage}`}
                      alt={category.name}
                      style={{ width: '50px', height: '50px' }}
                      className='object-cover object-top'
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
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
      <ToastContainer />
    </div>
  );
};

export default ViewChildCategory;