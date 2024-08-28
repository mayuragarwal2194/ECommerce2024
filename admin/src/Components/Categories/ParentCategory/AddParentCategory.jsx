import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL, getTopCategories } from '../../../Services/api';

const AddParentCategory = () => {
  const initialCategoryState = {
    name: '',
    megaMenu: false,
    showInNavbar: true,
    topCategory: '',
    parentImage: '',  // Add parentImage to the initial state
    imageUrl: '' // URL of the image for edit mode
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(initialCategoryState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [topCategories, setTopCategories] = useState([]);  // State to store top categories
  const [image, setImage] = useState(null); // State for the image file
  const [imagePreview, setImagePreview] = useState(''); // State for image preview URL

  useEffect(() => {
    if (location.state?.category) {
      setCategory({
        ...location.state.category,
        imageUrl: location.state.category.parentImage // Assuming childImage contains the relative path
      });
      setIsEditMode(true);
    }
  }, [location.state]);

  useEffect(() => {
    // Fetch top categories when the component mounts
    const fetchTopCategories = async () => {
      try {
        const data = await getTopCategories();
        setTopCategories(data);
      } catch (error) {
        toast.error('Failed to fetch top categories');
      }
    };
    fetchTopCategories();
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
      setImage(file); // Set the file to state
      setImagePreview(URL.createObjectURL(file)); // Set the preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('megaMenu', category.megaMenu);
    formData.append('showInNavbar', category.showInNavbar);
    formData.append('topCategory', category.topCategory);

    if (image) {
      formData.append('parentImage', image); // Append the image file
    }

    const url = isEditMode
      ? `${API_URL}/api/v1/parentcategories/${category._id}`
      : `${API_URL}/api/v1/parentcategories`;

    try {
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Category updated successfully!' : 'Category added successfully!');
        setCategory(initialCategoryState); // Reset form state
        setImage(null); // Reset image file state
        setImagePreview(''); // Reset image preview state
        navigate('/parentcategories/view', { state: { message: `Category ${isEditMode ? 'updated' : 'added'} successfully` } }); // Redirect to view page after success
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add or update category');
      }
    } catch (error) {
      toast.error('Error adding or updating category');
    }
  };

  const imageSrc = imagePreview || (category.imageUrl ? `http://localhost:5000/${category.imageUrl}` : '');

  return (
    <div className="add-category">
      <h2 className="mb-4">
        {isEditMode ? 'Edit Parent Category' : 'Add Parent Category'}
      </h2>
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
        <div>
          <label htmlFor='topCategory' className='cursor-pointer'>
            Top Category:
          </label>
          <select
            name="topCategory"
            id='topCategory'
            value={category.topCategory}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select a Top Category</option>
            {topCategories.map((topCat) => (
              <option key={topCat._id} value={topCat._id}>
                {topCat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='parentImage' className='cursor-pointer'>
            Parent Image:
          </label>
          <input
            type="file"
            name="parentImage"
            id='parentImage'
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        {imageSrc && (
          <div className="image-preview">
            <img src={imageSrc} alt="Image Preview" className="img-thumbnail mt-2" width={`150px`} />
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

export default AddParentCategory;