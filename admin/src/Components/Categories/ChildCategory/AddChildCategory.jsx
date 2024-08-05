import React, { useState, useEffect } from 'react';

const AddChildCategory = () => {
  const [category, setCategory] = useState({
    name: '',
    parent: '', // Single parent selection
    isActive: true,
    showInNavbar: false,
  });

  const [parentCategories, setParentCategories] = useState([]);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    // Fetch parent categories
    const fetchParentCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/parentcategories');
        const data = await response.json();
        setParentCategories(data);
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      }
    };

    fetchParentCategories();

    // Set category to edit if there's a category to edit
    if (categoryToEdit) {
      setCategory({
        ...categoryToEdit,
        parent: categoryToEdit.parent || '',
      });
    }
  }, [categoryToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting category data:', category); // Added logging for debugging

    try {
      const categoryData = {
        ...category,
      };

      let url = 'http://localhost:5000/childcategories/add';
      let method = 'POST';

      if (categoryToEdit) {
        url = `http://localhost:5000/childcategories/${categoryToEdit._id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        alert(categoryToEdit ? 'Category updated successfully!' : 'Category added successfully!');
        setCategory({
          name: '',
          parent: '', // Reset single parent selection
          isActive: true,
          showInNavbar: false,
        }); // Reset form state
        setCategoryToEdit(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add or update category');
      }
    } catch (error) {
      console.error('Error adding or updating category:', error.message);
      alert(error.message);
    }
  };

  return (
    <div className="add-category">
      <h2>{categoryToEdit ? 'Edit Child Category' : 'Add Child Category'}</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-start gap-3">
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={handleChange}
          placeholder="Category Name"
          required
          autoComplete='true'
          className="px-2"
        />
        <select
          name="parent"
          value={category.parent}
          onChange={handleChange}
          className="px-2"
          required
        >
          <option value="">Select Parent Category</option>
          {parentCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
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
          {categoryToEdit ? 'Update Category' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddChildCategory;