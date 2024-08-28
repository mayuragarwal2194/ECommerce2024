import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL, getParentCategories } from '../../../Services/api';

const AddChildCategory = () => {
  const initialCategoryState = {
    name: '',
    parent: '', // Default to empty string
    megaMenu: false,
    showInNavbar: true,
    childImage: null,
    imageUrl: '', // URL of the image for edit mode
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(initialCategoryState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (location.state?.category) {
      const categoryData = location.state.category;
      setCategory({
        ...categoryData,
        parent: categoryData.parent?._id || '', // Convert null to empty string
        imageUrl: categoryData.childImage || '' // Ensure imageUrl is a string
      });
      setIsEditMode(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const data = await getParentCategories();
        setParentCategories(data);
      } catch (error) {
        toast.error('Failed to fetch parent categories');
      }
    };
    fetchParentCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory({
      ...category,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('megaMenu', category.megaMenu);
    formData.append('showInNavbar', category.showInNavbar);
    formData.append('parent', category.parent || ''); // Ensure empty string if null

    if (image) {
      formData.append('childImage', image);
    }

    const url = isEditMode
      ? `${API_URL}/api/v1/childcategories/${category._id}`
      : `${API_URL}/api/v1/childcategories`;

    try {
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(isEditMode ? 'Category updated successfully!' : 'Category added successfully!');
        setCategory(initialCategoryState);
        setImage(null); // Reset image file state
        setImagePreview(''); // Reset image preview state
        navigate('/childcategories/view', { state: { message: `Category ${isEditMode ? 'updated' : 'added'} successfully` } });
      } else {
        toast.error(responseData.message || 'Failed to add or update category');
      }
    } catch (error) {
      toast.error('Error adding or updating category');
    }
  };

  // Ensure that `imageSrc` is always a string
  const imageSrc = imagePreview || (category.imageUrl ? `http://localhost:5000/${category.imageUrl}` : '');

  return (
    <div className="add-category">
      <h2 className="mb-4">{isEditMode ? 'Edit Child Category' : 'Add Child Category'}</h2>
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
        <select
          name="parent"
          value={category.parent || ''} // Ensure the value is an empty string if null
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

        <div className=''>
          <div className='form-check'>
            <label htmlFor='megaMenu' className='form-check-label cursor-pointer'>
              Mega Menu:
            </label>
            <input
              type="checkbox"
              name="megaMenu"
              id="megaMenu"
              checked={category.megaMenu}
              onChange={handleChange}
              className='form-check-input'
            />
          </div>
          <div className='form-check'>
            <label htmlFor='showInNavbar' className='form-check-label cursor-pointer'>
              Show in Navbar:
            </label>
            <input
              type="checkbox"
              name="showInNavbar"
              id="showInNavbar"
              checked={category.showInNavbar}
              onChange={handleChange}
              className='form-check-input'
            />
          </div>
        </div>
        <label>
          Child Image:
          <input
            type="file"
            name="childImage"
            onChange={handleFileChange}
            className="form-control"
          />
        </label>
        {imageSrc && (
          <div className="image-preview">
            <img src={imageSrc} alt="Image Preview" className="img-thumbnail mt-2" width="150px" />
          </div>
        )}
        <button type="submit" className="btn_fill_red text-white px-4 py-2 rounded-pill cursor-pointer fw-500">
          {isEditMode ? 'Update Category' : 'Add Category'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddChildCategory;