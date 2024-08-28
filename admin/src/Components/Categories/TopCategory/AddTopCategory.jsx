import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../../Services/api';

const AddTopCategory = () => {
  const initialCategoryState = {
    name: '',
    megaMenu: false,
    showInNavbar: true,
    topImage: null, // For file upload
    imageUrl: '', // URL of the image for edit mode
  }

  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(initialCategoryState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (location.state?.category) {
      setCategory({
        ...location.state.category,
        imageUrl: location.state.category.topImage // Assuming childImage contains the relative path
      });
      setIsEditMode(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategory({
      ...category,
      [name]: type === 'checkbox' ? checked : value,
    });
    console.log(`Field changed: ${name}, Value: ${type === 'checkbox' ? checked : value}`); // Log field changes
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
    if (image) {
      formData.append('topImage', image);
    }

    const url = isEditMode
      ? `${API_URL}/api/v1/topcategories/${category._id}`
      : `${API_URL}/api/v1/topcategories`;

    try {
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
      });

      if (response.ok) {
        const successMessage = isEditMode
          ? 'Top category updated successfully!'
          : 'Top category added successfully!';

        setCategory(initialCategoryState); // Reset form state
        setImage(null); // Reset image file state
        setImagePreview(''); // Reset image preview state
        navigate('/viewtopcategory', { state: { message: successMessage } }); // Redirect to view page after success
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add or update top category');
      }
    } catch (error) {
      toast.error('Error adding or updating top category');
    }
  };


  const imageSrc = imagePreview || (category.imageUrl ? `http://localhost:5000/${category.imageUrl}` : '');

  return (
    <div className="add-category">
      <h2 className="mb-4">{isEditMode ? 'Edit Top Category' : 'Add Top Category'}</h2>
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
        <div className='d-flex align-items-center gap-3'>
          <div className="form-check">
            <label className='form-check-label cursor-pointer' htmlFor='megaMenu'>Mega Menu:</label>
            <input
              type="checkbox"
              className="form-check-input"
              name="megaMenu"
              id='megaMenu'
              checked={category.megaMenu}
              onChange={handleChange}
            />
          </div>
          <div className='form-check'>
            <label className='form-check-label cursor-pointer' htmlFor='showInNavbar'>
              Show in Navbar:
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              name="showInNavbar"
              id='showInNavbar'
              checked={category.showInNavbar}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className='cursor-pointer d-block mb-1' htmlFor='topImage'>Top Image:</label>
          <input
            type="file"
            name="topImage"
            id='topImage'
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        {imageSrc && (
          <div className="image-preview">
            <img src={imageSrc} alt="Image Preview" className="img-thumbnail mt-2" width="150px" />
          </div>
        )}
        <button type="submit" className="btn_fill_red text-white px-4 py-2 mt-4 rounded cursor-pointer fw-500">
          {isEditMode ? 'Update Top Category' : 'Add Top Category'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddTopCategory;