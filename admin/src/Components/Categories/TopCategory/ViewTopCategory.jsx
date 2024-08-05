import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL, getTopCategories } from '../../../Services/api';

const ViewTopCategory = () => {
  const [topCategories, setTopCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopCategories();
  }, []);

  const fetchTopCategories = async () => {
    try {
      const data = await getTopCategories();
      setTopCategories(data);
    } catch (error) {
      console.error('Error fetching top categories:', error);
    }
  };

  const handleEdit = (category) => {
    navigate(`/addtopcategory`, { state: { category, isEditMode: true } });
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${API_URL}/api/v1/topcategories/${categoryId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Category deleted successfully');
          fetchTopCategories();
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Error deleting category');
      }
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">View Top Categories</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Active</th>
              <th>Show in Navbar</th>
              <th>Children</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topCategories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.isActive ? 'Yes' : 'No'}</td>
                <td>{category.showInNavbar ? 'Yes' : 'No'}</td>
                <td>
                  {category.children.length > 0 ? (
                    <ul>
                      {category.children.map(child => (
                        <li key={child._id}>{child.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>No children</span>
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

export default ViewTopCategory;