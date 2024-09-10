import React, { useContext, useState, useEffect } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';
import DescriptionBox from '../DescriptionBox/DescriptionBox';
import { API_URL } from '../../services/api';
import SyncedSlider from '../SyncedSlider/SyncedSlider';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [variantImages, setVariantImages] = useState({
    featuredImage: '',
    galleryImages: []
  });
  const [availableSizes, setAvailableSizes] = useState([]);
  const [sizeIdMap, setSizeIdMap] = useState({});

  useEffect(() => {
    if (product.variants.length > 0) {
      const initialColor = product.variants[0].attributes.color;
      setSelectedColor(initialColor);
      const initialVariant = product.variants.find(variant => variant.attributes.color === initialColor);

      if (initialVariant) {
        setVariantImages({
          featuredImage: `${API_URL}/uploads/variants/featured/${initialVariant.variantFeaturedImage}`,
          galleryImages: initialVariant.variantGalleryImages.map(image => `${API_URL}/uploads/variants/gallery/${image}`)
        });

        // Create a mapping of size IDs to size names
        const sizeIdMap = {};
        initialVariant.attributes.size.forEach(size => {
          sizeIdMap[size._id.toString()] = size.sizeName;
        });
        setSizeIdMap(sizeIdMap);

        const initialSizes = Object.keys(initialVariant.sizeStock).map(sizeId => sizeIdMap[sizeId] || sizeId);
        setAvailableSizes([...new Set(initialSizes)]);

        if (initialSizes.length > 0) {
          setSelectedSize(initialSizes[0]);
          setQuantity(initialVariant.sizeStock[Object.keys(initialVariant.sizeStock).find(sizeId => sizeIdMap[sizeId] === initialSizes[0])] || 0);
        }
      }
    }
  }, [product.variants]);

  useEffect(() => {
    if (selectedColor) {
      const selectedVariant = product.variants.find(variant => variant.attributes.color === selectedColor);

      if (selectedVariant) {
        setVariantImages({
          featuredImage: `${API_URL}/uploads/variants/featured/${selectedVariant.variantFeaturedImage}`,
          galleryImages: selectedVariant.variantGalleryImages.map(image => `${API_URL}/uploads/variants/gallery/${image}`)
        });

        // Create a mapping of size IDs to size names
        const sizeIdMap = {};
        selectedVariant.attributes.size.forEach(size => {
          sizeIdMap[size._id.toString()] = size.sizeName;
        });
        setSizeIdMap(sizeIdMap);

        const newSizes = Object.keys(selectedVariant.sizeStock).map(sizeId => sizeIdMap[sizeId] || sizeId);
        setAvailableSizes([...new Set(newSizes)]);

        if (newSizes.length > 0) {
          setSelectedSize(newSizes[0]);
          setQuantity(selectedVariant.sizeStock[Object.keys(selectedVariant.sizeStock).find(sizeId => sizeIdMap[sizeId] === newSizes[0])] || 0);
        }
      }
    }
  }, [selectedColor, product.variants]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const selectedVariant = product.variants.find(variant => variant.attributes.color === selectedColor);
      if (selectedVariant) {
        const sizeId = Object.keys(selectedVariant.sizeStock).find(sizeId => sizeIdMap[sizeId] === selectedSize);
        setQuantity(selectedVariant.sizeStock[sizeId] || 0);
      }
    }
  }, [selectedSize, selectedColor, product.variants]);

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart(product.id, selectedSize, selectedColor);
    } else {
      alert('Please select both size and color');
    }
  };

  const images = [
    variantImages.featuredImage,
    ...Array.isArray(variantImages.galleryImages) ? variantImages.galleryImages : []
  ].filter(image => image);

  const colorOptions = product.variants.map((variant) => ({
    color: variant.attributes.color,
    image: variant.variantFeaturedImage,
  }));

  return (
    <>
      <div className='productdisplay my-4 d-lg-flex align-items-start gap-5'>
        <div className="productdisplay-left">
          <SyncedSlider images={images} />
        </div>
        <div className="productdisplay-right d-flex flex-column gap-3">
          <h1 className='product-title mb-0 fw-600'>{product.itemName}</h1>
          <p className="product-description mb-0">
            {product.shortDescription || "This is a static description. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure officia debitis vero consequuntur dolorum sapiente id, incidunt distinctio vitae repellat doloremque ea."}
          </p>
          <div className="productdisplay-stars d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-half-fill"></i>
              <i className="ri-star-line"></i>
            </div>
            <p className='mb-0'>(122 Ratings)</p>
          </div>
          <div className="product-prices d-flex align-items-center gap-4">
            <div className="current-price fw-600">${product.newPrice}</div>
            <div className="old-price text-decoration-line-through">
              ${product.oldPrice}
            </div>
            <span className='product-discount'>(53% OFF)</span>
          </div>
          <div className="productdisplay-size">
            <h1 className='text-uppercase fw-bold'>Select Size</h1>
            <ul className="product-sizes mb-0 list-unstyled d-flex align-items-center gap-3">
              {availableSizes.map((size, index) => (
                <li
                  key={index}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </li>
              ))}
            </ul>
          </div>
          <div className="productdisplay-color">
            <h1 className='text-uppercase fw-bold'>Select Color</h1>
            <ul className="color-options mb-0 list-unstyled d-flex align-items-center gap-3">
              {colorOptions.map((colorOption, index) => (
                <li
                  key={index}
                  className={`color-option ${selectedColor === colorOption.color ? 'selected' : ''}`}
                  style={{ backgroundImage: `url(${API_URL}/uploads/variants/featured/${colorOption.image})` }}
                  onClick={() => setSelectedColor(colorOption.color)}
                >
                </li>
              ))}
            </ul>
          </div>
          <div className="product-quantity">
            <h1 className='text-uppercase fw-bold'>Stock Quantity</h1>
            <p>{quantity} items available</p>
          </div>

          <div className='productdisplay-add-btn d-lg-flex align-items-center gap-3'>
            <div
              role="button"
              className="ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-inline-block w-75 text-center"
              onClick={handleAddToCart}
            >
              Add to cart
            </div>
            <div role="button" className="ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-inline-block w-75 text-center">Wishlist</div>
          </div>
          <div className="product-buy-now-btn w-100">
            <div role="button" className="ff-btn ff-btn-fill-dark text-uppercase text-decoration-none d-inline-block w-100 text-center">Buy Now</div>
          </div>
          <div className="payment-info">
            <div className="payment-head">GUARANTEED SAFE CHECKOUT:</div>
            <div className="payment-info-image w-50 mt-2">
              <img src="/images/payment-info.png" alt="Payment Info" className='w-100' />
            </div>
          </div>
        </div>
      </div>
      <DescriptionBox description={product.fullDescription} />
    </>
  );
};

export default ProductDisplay;