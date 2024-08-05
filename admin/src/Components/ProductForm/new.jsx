// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ShopContext } from '../../Context/ShopContext';
// import './ProductForm.css'

// const ProductForm = ({ fetchProducts }) => {
//   const { childCategories, parentCategories } = useContext(ShopContext);
//   const [product, setProduct] = useState({
//     id: '',
//     itemName: '',
//     newPrice: '',
//     oldPrice: '',
//     category: '',
//     isPopular: false,
//     tags: [],
//     shortDescription: '',
//     fullDescription: '',
//     stockStatus: 'In Stock',
//     variants: [],
//   });
//   const [featuredImage, setFeaturedImage] = useState(null);
//   const [gallery, setGallery] = useState([]);
//   const [activeTab, setActiveTab] = useState('addProduct');
//   const [dragActive, setDragActive] = useState(false);
//   const navigate = useNavigate();
//   const { productId } = useParams();

//   useEffect(() => {
//     if (productId) {
//       fetchProductDetails(productId);
//       setActiveTab('editProduct');
//     }
//   }, [productId]);

//   const fetchProductDetails = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/products/${id}`);
//       if (response.ok) {
//         const data = await response.json();
//         setProduct(data);
//       } else {
//         console.error('Failed to fetch product details');
//       }
//     } catch (error) {
//       console.error('Error fetching product details:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct((prevProduct) => ({
//       ...prevProduct,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleVariantChange = (index, e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct((prevProduct) => {
//       const updatedVariants = [...prevProduct.variants];
//       updatedVariants[index] = {
//         ...updatedVariants[index],
//         [name]: type === 'checkbox' ? checked : value,
//       };
//       return { ...prevProduct, variants: updatedVariants };
//     });
//   };

//   const handleVariantImageChange = (index, e, field) => {
//     const files = e.target.files;
//     setProduct((prevProduct) => {
//       const updatedVariants = [...prevProduct.variants];
//       updatedVariants[index][field] = field === 'gallery' ? [...files] : files[0];
//       return { ...prevProduct, variants: updatedVariants };
//     });
//   };

//   const handleImageChange = (e) => {
//     setFeaturedImage(e.target.files[0]);
//   };

//   const handleGalleryChange = (e) => {
//     setGallery([...e.target.files]);
//   };

//   const handleTagsChange = (e) => {
//     const { value } = e.target;
//     setProduct((prevProduct) => ({
//       ...prevProduct,
//       tags: [value], // Store the selected value in an array
//     }));
//   };

//   const resetForm = () => {
//     setProduct({
//       id: '',
//       itemName: '',
//       newPrice: '',
//       oldPrice: '',
//       category: '',
//       isPopular: false,
//       tags: [],
//       shortDescription: '',
//       fullDescription: '',
//       stockStatus: 'In Stock',
//       variants: [],
//     });
//     setFeaturedImage(null);
//     setGallery([]);
//     const fileInput = document.getElementById('productImage');
//     if (fileInput) {
//       fileInput.value = null;
//     }
//     const galleryInput = document.getElementById('productGallery');
//     if (galleryInput) {
//       galleryInput.value = null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('id', product.id);
//     formData.append('itemName', product.itemName);
//     formData.append('newPrice', product.newPrice);
//     formData.append('oldPrice', product.oldPrice);
//     formData.append('category', product.category);
//     formData.append('isPopular', product.isPopular);
//     formData.append('shortDescription', product.shortDescription);
//     formData.append('fullDescription', product.fullDescription);
//     formData.append('stockStatus', product.stockStatus);
//     product.tags.forEach(tag => formData.append('tags', tag));
//     if (featuredImage) {
//       formData.append('featuredImage', featuredImage);
//     }
//     gallery.forEach((image, index) => {
//       formData.append(`gallery`, image);
//     });
//     if (product.variants) {
//       product.variants.forEach((variant, index) => {
//         for (const key in variant) {
//           if (key === 'gallery') {
//             variant[key].forEach((image, i) => {
//               formData.append(`variants[${index}][gallery][${i}]`, image);
//             });
//           } else {
//             formData.append(`variants[${index}][${key}]`, variant[key]);
//           }
//         }
//       });
//     }

//     try {
//       let response;
//       if (activeTab === 'editProduct') {
//         response = await fetch(`http://localhost:5000/products/${product._id}`, {
//           method: 'PUT',
//           body: formData,
//         });
//       } else {
//         response = await fetch('http://localhost:5000/products/add', {
//           method: 'POST',
//           body: formData,
//         });
//       }

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         resetForm();
//         fetchProducts();
//         navigate('/admin');
//       } else {
//         const errorData = await response.json();
//         console.error('Failed to submit form', errorData);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };


//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragActive(true);
//   };

//   const handleDragLeave = () => {
//     setDragActive(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragActive(false);
//     const files = Array.from(e.dataTransfer.files);
//     setGallery((prevGallery) => [...prevGallery, ...files]);
//   };

//   return (
//     <div className="w-100">
//       <h2 className="mb-4">{activeTab === 'addProduct' ? 'Add Product' : 'Edit Product'}</h2>
//       <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
//         <div className="">
//           <input
//             name="id"
//             value={product.id}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//             placeholder="ID"
//           />
//           <input
//             name="itemName"
//             value={product.itemName}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//             placeholder="Item Name"
//             required
//           />
//         </div>
//         <div>
//           <input
//             type="number"
//             name="newPrice"
//             value={product.newPrice}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//             placeholder="New Price"
//             required
//           />
//           <input
//             type="number"
//             name="oldPrice"
//             value={product.oldPrice}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//             placeholder="Old Price"
//           />
//         </div>
//         <div>
//           <select
//             name="category"
//             value={product.category}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//             required
//           >
//             <option value="">Select Category</option>
//             {childCategories.map((child) => (
//               <option key={child._id} value={child._id}>
//                 {`${child.name} (${child.parents.map(parent => parent.name).join(', ')})`}
//               </option>
//             ))}
//           </select>
//           <div className="mt-3">
//             <div>
//               <label htmlFor="productImage">Featured Image</label>
//               <input type="file" id="productImage" onChange={handleImageChange} className="" />
//             </div>
//             <div className='mt-3'>
//               <label htmlFor="productGallery">Gallery Images</label>
//               <div
//                 className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//               >
//                 <input type="file" id="productGallery" onChange={handleGalleryChange} className="file-input" multiple />
//                 <p>Drag & drop files here, or click to select files</p>
//               </div>
//               <div className="gallery-preview mt-3">
//                 {gallery.map((file, index) => (
//                   <div key={index} className="gallery-item">
//                     <img src={URL.createObjectURL(file)} alt={`gallery-${index}`} className="gallery-image" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="form-check">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             id="isPopular"
//             name="isPopular"
//             checked={product.isPopular}
//             onChange={handleChange}
//           />
//           <label className="form-check-label" htmlFor="isPopular">
//             Popular Product
//           </label>
//         </div>
//         <div>
//           <label htmlFor="shortDescription">Short Description</label>
//           <textarea
//             name="shortDescription"
//             value={product.shortDescription}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//             placeholder="Short Description"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="fullDescription">Full Description</label>
//           <textarea
//             name="fullDescription"
//             value={product.fullDescription}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//             placeholder="Full Description"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="tags">Tags</label>
//           <select
//             name="tags"
//             value={product.tags[0] || ''} // Ensure this is a single value
//             onChange={handleTagsChange}
//             className="px-3 py-1 me-3"
//           >
//             <option value="">Select Tag</option>
//             <option value="best seller white">Best Seller White</option>
//             <option value="best seller black">Best Seller Black</option>
//             <option value="new white">New White</option>
//             <option value="new black">New Black</option>
//           </select>
//         </div>

//         <div>
//           <label htmlFor="stockStatus">Stock Status</label>
//           <select
//             name="stockStatus"
//             value={product.stockStatus}
//             onChange={handleChange}
//             className="px-3 py-1 me-3"
//           >
//             <option value="In Stock">In Stock</option>
//             <option value="Out Of Stock">Out Of Stock</option>
//           </select>
//         </div>
//         <h4>Variants</h4>
//         {product.variants.map((variant, index) => (
//           <div key={index} className="mb-4">
//             <h5>Variant {index + 1}</h5>
//             <input
//               name="size"
//               value={variant.size}
//               onChange={(e) => handleVariantChange(index, e)}
//               className="px-3 py-1 me-3"
//               placeholder="Size"
//             />
//             <input
//               name="color"
//               value={variant.color}
//               onChange={(e) => handleVariantChange(index, e)}
//               className="px-3 py-1 me-3"
//               placeholder="Color"
//             />
//             <input
//               name="newPrice"
//               value={variant.newPrice}
//               onChange={(e) => handleVariantChange(index, e)}
//               className="px-3 py-1 me-3"
//               placeholder="New Price"
//               type="number"
//             />
//             <input
//               name="oldPrice"
//               value={variant.oldPrice}
//               onChange={(e) => handleVariantChange(index, e)}
//               className="px-3 py-1 me-3"
//               placeholder="Old Price"
//               type="number"
//             />
//             <input
//               name="quantity"
//               value={variant.quantity}
//               onChange={(e) => handleVariantChange(index, e)}
//               className="px-3 py-1 me-3"
//               placeholder="Quantity"
//               type="number"
//               required
//             />
//             <input
//               type="file"
//               onChange={(e) => handleVariantImageChange(index, e, 'featuredImage')}
//               className=""
//             />
//             <input
//               type="file"
//               onChange={(e) => handleVariantImageChange(index, e, 'gallery')}
//               className=""
//               multiple
//             />
//           </div>
//         ))}
//         <div>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() =>
//               setProduct((prevProduct) => ({
//                 ...prevProduct,
//                 variants: [
//                   ...prevProduct.variants,
//                   {
//                     size: '',
//                     color: '',
//                     newPrice: 0,
//                     oldPrice: 0,
//                     quantity: 0,
//                     featuredImage: '',
//                     gallery: [],
//                   },
//                 ],
//               }))
//             }
//           >
//             Add Variant
//           </button>
//         </div>
//         <div>
//           <button type="submit" className="btn_fill_red text-white px-4 py-2 rounded-pill cursor-pointer fw-500">
//             {activeTab === 'editProduct' ? 'Update Product' : 'Add Product'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;


























import React, { useEffect, useState } from 'react';
import { API_URL, getChildCategories, getAvailableSizes } from '../../Services/api'; // Import the API_URL from your services file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductForm.css';

const ProductForm = () => {
  // Define state variables for form fields
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
    attributes: {
      color: '',
      size: []
    },
    variantFeaturedImage: null,
    variantGalleryImages: []
  }]);


  const [childCategories, setChildCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

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

  useEffect(() => {
    const fetchChildCategories = async () => {
      try {
        console.log('Calling getChildCategories API');
        const data = await getChildCategories(); // Use the getChildCategories function
        console.log('Fetched Child Categories:', data); // Log fetched data
        setChildCategories(data);
      } catch (error) {
        console.error('Error fetching child categories:', error);
        toast.error('Error fetching child categories');
      }
    };

    fetchChildCategories();
  }, []);

  // Handle form field changes
  const handleChange = (setter) => (e) => setter(e.target.value);
  const handleFileChange = (setter) => (e) => setter(e.target.files[0]);
  const handleGalleryChange = (e) => setGalleryImages(Array.from(e.target.files));

  // Handle variant input changes
  const handleVariantChange = (index, field, isAttribute = false) => (e) => {
    const value = e.target.value;
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index
          ? isAttribute
            ? { ...variant, attributes: { ...variant.attributes, [field]: value } }
            : { ...variant, [field]: value }
          : variant
      )
    );
  };

  const handleVariantFileChange = (index, field) => (e) => {
    const file = e.target.files[0];
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, [field]: file } : variant
      )
    );
  };

  const handleVariantGalleryChange = (index) => (e) => {
    const files = Array.from(e.target.files);
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, variantGalleryImages: files } : variant
      )
    );
  };

  const handleSizeChange = (index, size) => (e) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index
          ? {
            ...variant,
            attributes: {
              ...variant.attributes,
              size: e.target.checked
                ? [...variant.attributes.size, size]
                : variant.attributes.size.filter((s) => s !== size),
            },
          }
          : variant
      )
    );
  };


  // Add a new variant form
  const addVariant = () => {
    setVariants([...variants, {
      sku: '',
      newPrice: '',
      oldPrice: '',
      quantity: '',
      attributes: {
        color: '',
        size: []
      },
      variantFeaturedImage: null,
      variantGalleryImages: []
    }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create a FormData object to hold the form data
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
    galleryImages.forEach((file, index) => {
      formData.append(`galleryImages`, file);
    });
    formData.append('stockStatus', stockStatus);
    formData.append('tag', tag);
    formData.append('variants', JSON.stringify(variants.map((variant, index) => ({
      ...variant,
      variantFeaturedImage: variant.variantFeaturedImage?.name,
      variantGalleryImages: variant.variantGalleryImages.map(file => file.name)
    })))); // Add variants to form data as a JSON string

    variants.forEach((variant, index) => {
      if (variant.variantFeaturedImage) {
        formData.append(`variantFeaturedImage${index}`, variant.variantFeaturedImage);
      }
      variant.variantGalleryImages.forEach((file, fileIndex) => {
        formData.append(`variantGalleryImages${index}`, file);
      });
    });


    try {
      // Send the form data to the server
      const response = await fetch(`${API_URL}/products/add`, {
        method: 'POST',
        body: formData,
      });

      // Check for a successful response
      if (!response.ok) {
        throw new Error('Server returned an error: ' + response.statusText);
      }

      const result = await response.json();
      console.log('Server Response:', result);

      // Display a success message using react-toastify
      toast.success('Product added successfully');

      // Reset form fields after successful submission
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
      setVariants([{ sku: '', newPrice: '', oldPrice: '', quantity: '', attributes: { color: '', size: [] }, variantFeaturedImage: null, variantGalleryImages: [] }]); // Reset variants
    } catch (error) {
      console.error('Error submitting form:', error);
      // Display an error message using react-toastify
      toast.error('Error submitting form: ' + error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
              onChange={handleFileChange(setFeaturedImage)}
              className="px-2 rounded w-100"
              required
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
                <option key={index} value={child._id}>
                  {`${child.name} (${child.parents.map(parent => parent.name).join(', ')})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Variants Form */}
        <div className="w-75 mb-5 pb-5">
          <h4>Variants</h4>
          {variants.map((variant, index) => (
            <div key={index} className="mb-3 border p-3 rounded">
              <h5>Variant {index + 1}</h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="input-wrapper w-25">
                  <label htmlFor={`sku-${index}`} className="cursor-pointer d-block mb-1">SKU</label>
                  <input
                    type="text"
                    id={`sku-${index}`}
                    placeholder="SKU"
                    className="px-2 rounded w-100"
                    value={variant.sku}
                    onChange={handleVariantChange(index, 'sku')}
                    required
                  />
                </div>
                <div className="input-wrapper w-25">
                  <label htmlFor={`newPrice-${index}`} className="cursor-pointer d-block mb-1">New Price</label>
                  <input
                    type="number"
                    id={`newPrice-${index}`}
                    placeholder="New Price"
                    className="px-2 rounded w-100"
                    value={variant.newPrice}
                    onChange={handleVariantChange(index, 'newPrice')}
                    required
                  />
                </div>
                <div className="input-wrapper w-25">
                  <label htmlFor={`oldPrice-${index}`} className="cursor-pointer d-block mb-1">Old Price</label>
                  <input
                    type="number"
                    id={`oldPrice-${index}`}
                    placeholder="Old Price"
                    className="px-2 rounded w-100"
                    value={variant.oldPrice}
                    onChange={handleVariantChange(index, 'oldPrice')}
                  />
                </div>
                <div className="input-wrapper w-25">
                  <label htmlFor={`quantity-${index}`} className="cursor-pointer d-block mb-1">Quantity</label>
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    placeholder="Quantity"
                    className="px-2 rounded w-100"
                    value={variant.quantity}
                    onChange={handleVariantChange(index, 'quantity')}
                    required
                  />
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="input-wrapper w-50">
                  <label htmlFor={`color-${index}`} className="cursor-pointer d-block mb-1">Color</label>
                  <input
                    type="text"
                    id={`color-${index}`}
                    placeholder="Color"
                    className="px-2 rounded w-100"
                    value={variant.attributes.color}
                    onChange={handleVariantChange(index, 'color', true)}
                  />
                </div>
                <div className="input-wrapper w-50">
                  <label htmlFor={`variantSize${index}`} className="cursor-pointer d-block mb-1">Size</label>
                  <div>
                    {availableSizes.map((size) => (
                      <label key={size._id} className="d-inline-block me-2">
                        <input
                          type="checkbox"
                          name={`variantSize${index}`}
                          value={size.sizeName}
                          checked={variant.attributes.size.includes(size.sizeName)}
                          onChange={handleSizeChange(index, size.sizeName)}
                        />
                        {size.sizeName}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div>
                  <label htmlFor={`variantFeaturedImage-${index}`} className="cursor-pointer d-block mb-1">Variant Featured Image</label>
                  <input
                    type="file"
                    id={`variantFeaturedImage-${index}`}
                    onChange={handleVariantFileChange(index, 'variantFeaturedImage')}
                    className="form-control"
                  />
                </div>
                <div>
                  <label htmlFor={`variantGalleryImages-${index}`} className="cursor-pointer d-block mb-1">Variant Gallery Images</label>
                  <input
                    type="file"
                    id={`variantGalleryImages-${index}`}
                    onChange={handleVariantGalleryChange(index)}
                    multiple
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addVariant}>
            Add Variant
          </button>
        </div>
        <button type="submit" className="btn_fill_red text-white px-4 py-2 rounded cursor-pointer fw-500">Add Product</button>
      </form>
      <ToastContainer />
    </>
  );
};

export default ProductForm;
