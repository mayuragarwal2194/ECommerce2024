import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, getChildCategories, getAvailableSizes } from '../../Services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductForm.css';
import VariantForm from './VariantForm/VariantForm';

const ProductForm = () => {
  const { _id } = useParams(); // Get _id from URL params
  const navigate = useNavigate();

  // Track edit mode
  const [isEditMode, setIsEditMode] = useState(false); // Track whether we're editing

  // Form States
  const [id, setId] = useState('');
  const [itemName, setItemName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [stockStatus, setStockStatus] = useState('In Stock');
  const [tag, setTag] = useState('');
  const [variants, setVariants] = useState([{
    sku: '',
    newPrice: '',
    oldPrice: '',
    quantity: '',
    sizeStock: {},
    attributes: {
      color: '',
      size: []
    },
    variantFeaturedImage: null,
    variantGalleryImages: []
  }]);

  // Preview States
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]);
  const [variantPreviews, setVariantPreviews] = useState([{
    variantFeaturedImagePreview: null,
    variantGalleryImagesPreview: []
  }]);

  // Additional Data States
  const [childCategories, setChildCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  // Fetch available sizes on component mount
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const sizes = await getAvailableSizes();
        setAvailableSizes(sizes);
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };
    fetchSizes();
  }, []);

  // Fetch child categories on component mount
  useEffect(() => {
    const fetchChildCategories = async () => {
      try {
        const data = await getChildCategories();
        setChildCategories(data);
      } catch (error) {
        console.error('Error fetching child categories:', error);
        toast.error('Error fetching child categories');
      }
    };
    fetchChildCategories();
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (_id) {
      setIsEditMode(true);
      const fetchProductData = async () => {
        try {
          const response = await fetch(`${API_URL}/products/${_id}`);
          const product = await response.json();

          // Set form states
          setId(product.id);
          setItemName(product.itemName);
          setNewPrice(product.newPrice);
          setOldPrice(product.oldPrice);
          setCategory(product.category._id);
          setIsPopular(product.isPopular);
          setShortDescription(product.shortDescription);
          setFullDescription(product.fullDescription);
          setStockStatus(product.stockStatus);
          setTag(product.tag);

          // Handle sizes and variants
          setVariants(product.variants.map(variant => ({
            ...variant,
            attributes: {
              ...variant.attributes,
              size: variant.attributes.size.map(size =>
                typeof size === 'string' ? size : size.toString() // Ensure size is in string format
              )
            },
            variantFeaturedImage: null, // Placeholder for feature image
            variantGalleryImages: []    // Placeholder for gallery images
          })));

          // Reset and populate image states
          setFeaturedImage(null);
          setGalleryImages([]);

          // Set image previews
          setFeaturedImagePreview(product.featuredImage ? `${API_URL}/uploads/featured/${product.featuredImage}` : null);
          setGalleryImagesPreview(product.galleryImages.map(img => `${API_URL}/uploads/gallery/${img}`));
          setVariantPreviews(product.variants.map(variant => ({
            variantFeaturedImagePreview: variant.variantFeaturedImage ? `${API_URL}/uploads/variants/featured/${variant.variantFeaturedImage}` : null,
            variantGalleryImagesPreview: variant.variantGalleryImages.map(img => `${API_URL}/uploads/variants/gallery/${img}`)
          })));

        } catch (error) {
          console.error('Error fetching product data:', error);
          toast.error('Error fetching product data');
        }
      };
      fetchProductData();
    }
  }, [_id]);

  // Handle form field changes
  const handleChange = (setter) => (e) => setter(e.target.value);
  const handleFileChange = (setter, setPreview) => (e) => {
    const file = e.target.files[0];
    setter(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };


  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(files);
    setGalleryImagesPreview(files.map(file => URL.createObjectURL(file)));
  };


  const handleErrors = (errorData) => {
    if (errorData.error) {
      // Display specific error message from the server
      toast.error(`Error: ${errorData.error}`);
    } else if (errorData.errors) {
      // Handle validation errors, assuming errors are an array
      errorData.errors.forEach((error) => {
        toast.error(error.message); // Assuming each error has a `message` field
      });
    } else if (errorData.message) {
      // Display general error message from the server
      toast.error(`Error: ${errorData.message}`);
    } else {
      // Handle unexpected error formats
      toast.error('An unknown error occurred.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('itemName', itemName);
    formData.append('newPrice', newPrice);
    formData.append('oldPrice', oldPrice);
    formData.append('category', category);
    formData.append('isPopular', isPopular);
    formData.append('shortDescription', shortDescription);
    formData.append('fullDescription', fullDescription);
    formData.append('featuredImage', featuredImage);
    galleryImages.forEach((file) => {
      formData.append('galleryImages', file);
    });
    formData.append('stockStatus', stockStatus);
    formData.append('tag', tag);

    // Log variants before appending them to FormData
    console.log("Parsed Variants before submission:", JSON.stringify(variants));

    formData.append('variants', JSON.stringify(variants.map((variant) => ({
      ...variant,
      variantFeaturedImage: variant.variantFeaturedImage?.name,
      variantGalleryImages: variant.variantGalleryImages.map(file => file.name)
    }))));

    // Append variant images
    variants.forEach((variant, index) => {
      if (variant.variantFeaturedImage) {
        formData.append(`variantFeaturedImage${index}`, variant.variantFeaturedImage);
      }
      variant.variantGalleryImages.forEach((file) => {
        formData.append(`variantGalleryImages${index}`, file);
      });
    });

    // Log FormData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + JSON.stringify(pair[1]));
    }

    // Proceed with submission...
    try {
      const response = await fetch(`${API_URL}/products/${isEditMode ? `${_id}` : 'add'}`, {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        handleErrors(errorData);
      } else {
        const result = await response.json();
        toast.success(`Product ${isEditMode ? 'updated' : 'added'} successfully`);
        navigate(`/viewproduct`, { state: { message: `Product ${isEditMode ? 'updated' : 'added'} successfully` } });

        resetFormFields();
        // Reset form fields after successful submission...
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        toast.error('Network error: Please check your internet connection and try again.');
      } else {
        toast.error('Error submitting form: ' + error.message);
      }
    }
  };

  // Optional: You could extract this reset logic into its own function
  const resetFormFields = () => {
    setId('');
    setItemName('');
    setNewPrice('');
    setOldPrice('');
    setIsPopular(false);
    setShortDescription('');
    setFullDescription('');
    setFeaturedImage(null);
    setGalleryImages([]);
    setStockStatus('In Stock');
    setTag('');
    setVariants([{ sku: '', newPrice: '', oldPrice: '', quantity: '', attributes: { color: '', size: [] }, variantFeaturedImage: null, variantGalleryImages: [] }]);
    setFeaturedImagePreview(null);
    setGalleryImagesPreview([]);
    setVariantPreviews([{
      variantFeaturedImagePreview: null,
      variantGalleryImagesPreview: []
    }]);
  };

  useEffect(() => {
    return () => {
      // Revoke URLs to avoid memory leaks
      galleryImagesPreview.forEach(URL.revokeObjectURL);
      variantPreviews.forEach(preview => {
        if (preview.variantFeaturedImagePreview) {
          URL.revokeObjectURL(preview.variantFeaturedImagePreview);
        }
        preview.variantGalleryImagesPreview.forEach(URL.revokeObjectURL);
      });
    };
  }, [galleryImagesPreview, variantPreviews]);


  return (
    <>
      <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="d-flex align-items-center gap-3 w-75 mb-3">
          <div className="input-wrapper w-50">
            <label htmlFor="itemId" className="cursor-pointer d-block mb-1">Id</label>
            <input
              type="number"
              name="itemId"
              id="itemId"
              placeholder="Id"
              className="px-2 rounded w-100"
              value={id}
              onChange={handleChange(setId)}
              required
            />
          </div>
          <div className="input-wrapper w-50">
            <label htmlFor="itemName" className="cursor-pointer d-block mb-1">Product Name</label>
            <input
              type="text"
              name="itemName"
              id="itemName"
              placeholder="Product Name"
              className="px-2 rounded w-100"
              value={itemName}
              onChange={handleChange(setItemName)}
              required
            />
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 w-75 mb-3">
          <div className="input-wrapper w-50">
            <label htmlFor="newPrice" className="cursor-pointer d-block mb-1">New Price</label>
            <input
              type="number"
              name="newPrice"
              id="newPrice"
              placeholder="New Price"
              className="px-2 rounded w-100"
              value={newPrice}
              onChange={handleChange(setNewPrice)}
              required
            />
          </div>
          <div className="input-wrapper w-50">
            <label htmlFor="oldPrice" className="cursor-pointer d-block mb-1">Old Price</label>
            <input
              type="number"
              name="oldPrice"
              id="oldPrice"
              placeholder="Old Price"
              className="px-2 rounded w-100"
              value={oldPrice}
              onChange={handleChange(setOldPrice)}
            />
          </div>
        </div>
        <div className="d-flex align-items-start gap-3 w-75 mb-3">
          <div className="input-wrapper w-50">
            <label htmlFor="shortDescription" className="cursor-pointer d-block mb-1">Short Description</label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              placeholder="Short Description"
              value={shortDescription}
              onChange={handleChange(setShortDescription)}
              className="px-2 rounded w-100"
              required
            />
          </div>
          <div className="input-wrapper w-50">
            <label htmlFor="fullDescription" className="cursor-pointer d-block mb-1">Full Description</label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              placeholder="Full Description"
              value={fullDescription}
              onChange={handleChange(setFullDescription)}
              className="px-2 rounded w-100"
              required
            />
          </div>
        </div>
        <div className="d-flex align-items-start gap-3 w-75 mb-3">
          <div className="input-wrapper w-50">
            <label htmlFor="featuredImage" className="cursor-pointer d-block mb-1">Featured Image</label>
            <input
              type="file"
              id="featuredImage"
              onChange={handleFileChange(setFeaturedImage, setFeaturedImagePreview)}
              className="px-2 rounded w-100"
            // required
            />
          </div>
          <div className="input-wrapper w-50">
            <label htmlFor="galleryImages" className="cursor-pointer d-block mb-1">Gallery Images</label>
            <input
              type="file"
              id="galleryImages"
              onChange={handleGalleryChange}
              className="px-2 rounded w-100"
              multiple
            />
          </div>
        </div>
        <div className='d-flex gap-3 w-75 mb-5'>
          {featuredImagePreview && (
            <div className='w-50'>
              <h4>Featured Image Preview:</h4>
              <img src={featuredImagePreview} alt="Featured Preview" style={{ width: '200px', height: 'auto' }} />
            </div>
          )}
          {galleryImagesPreview.length > 0 && (
            <div className='w-50'>
              <h4>Gallery Images Preview:</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {galleryImagesPreview.map((preview, index) => (
                  <img key={index} src={preview} alt={`Gallery Preview ${index}`} style={{ width: '100px', height: 'auto' }} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isPopular"
            name="isPopular"
            checked={isPopular}
            onChange={(e) => setIsPopular(e.target.checked)}
          />
          <label className="form-check-label cursor-pointer" htmlFor="isPopular">
            Popular Product
          </label>
        </div>
        <div className="d-flex align-items-start gap-3 w-75 mb-3">
          <div className="input-wrapper w-50">
            <label htmlFor="stockStatus" className="cursor-pointer d-block mb-1">Stock Status</label>
            <select
              id="stockStatus"
              name="stockStatus"
              value={stockStatus}
              onChange={handleChange(setStockStatus)}
              className="px-2 rounded w-100"
              required
            >
              <option value="In Stock">In Stock</option>
              <option value="Out Of Stock">Out Of Stock</option>
            </select>
          </div>
          <div className="input-wrapper w-50">
            <label htmlFor="tag" className="cursor-pointer d-block mb-1">Select Tag</label>
            <select
              id="tag"
              name="tag"
              value={tag}
              onChange={handleChange(setTag)}
              className="px-2 rounded w-100"
              required
            >
              <option value="">Select Tag</option>
              <option value="best seller white">Best Seller White</option>
              <option value="best seller black">Best Seller Black</option>
              <option value="new white">New White</option>
              <option value="new black">New Black</option>
            </select>
          </div>
        </div>
        <div className="d-flex align-items-start gap-3 w-75 mb-5 pb-5">
          <div className="input-wrapper w-50">
            <label htmlFor="category" className="cursor-pointer d-block mb-1">Select Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleChange(setCategory)}
              className="px-2 rounded w-100"
              required
            >
              <option value="">Select Category</option>
              {childCategories.map((child, index) => (
                <option key={index} value={child._id} className='mb-2'>
                  {`${child?.name ?? 'Unknown Child'} (${child?.parent?.name ?? 'Unknown Parent'}-${child?.parent?.topCategory?.name?.toUpperCase() ?? 'UNKNOWN TOPCATEGORY'})`}
                  {/* {console.log(child)} */}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Variants Form */}
        <VariantForm
          availableSizes={availableSizes}
          variants={variants}
          setVariants={setVariants}
          variantPreviews={variantPreviews}
          setVariantPreviews={setVariantPreviews}
        />

        <button type="submit" className="btn_fill_red text-white px-4 py-2 rounded cursor-pointer fw-500">
          {isEditMode ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default ProductForm;
