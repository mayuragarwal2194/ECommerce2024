import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddParentCategory = () => {
  const initialCategoryState = {
    name: '',
    isActive: true,
    showInNavbar: true,
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(initialCategoryState);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
      setIsEditMode(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory({
      ...category,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode
      ? `http://localhost:5000/parentcategories/${category._id}`
      : 'http://localhost:5000/parentcategories/add';

    try {
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Category updated successfully!' : 'Category added successfully!');
        setCategory(initialCategoryState); // Reset form state
        navigate('/parentcategories/view'); // Redirect to view page after success
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add or update category');
      }
    } catch (error) {
      toast.error('Error adding or updating category');
    }
  };

  return (
    <div className="add-category">
      <h2 className="mb-4">{isEditMode ? 'Edit Parent Category' : 'Add Parent Category'}</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-start gap-3">
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={handleChange}
          placeholder="Category Name"
          required
          className="px-2"
          autoComplete="true"
        />
        <div>
          <label>
            Active:
            <input
              type="checkbox"
              name="isActive"
              checked={category.isActive}
              onChange={handleChange}
            />
          </label>
          <label>
            Show in Navbar:
            <input
              type="checkbox"
              name="showInNavbar"
              checked={category.showInNavbar}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" className="btn_fill_red text-white px-4 py-2 rounded-pill cursor-pointer fw-500">
          {isEditMode ? 'Update Category' : 'Add Category'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddParentCategory;