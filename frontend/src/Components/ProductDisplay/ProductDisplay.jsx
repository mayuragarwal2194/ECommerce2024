import React, { useContext, useState, useEffect, useMemo } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';
import DescriptionBox from '../DescriptionBox/DescriptionBox';
import { API_URL } from '../../services/api';
import SyncedSlider from '../SyncedSlider/SyncedSlider';
import Reviews from '../Reviews/Reviews';

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
  const [averageRating, setAverageRating] = useState('No ratings yet');

  // Memoizing the sizeIdMap
  const sizeIdMap = useMemo(() => {
    const map = {};
    product.variants.forEach(variant => {
      variant.attributes.size.forEach(size => {
        map[size._id.toString()] = size.sizeName;
      });
    });
    return map;
  }, [product.variants]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/reviews/${product._id}`);
        const data = await response.json();
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchAverageRating();
  }, [product._id]); // Update dependency array to match _id



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

        const initialSizes = Object.keys(initialVariant.sizeStock).map(sizeId => sizeIdMap[sizeId] || sizeId);
        setAvailableSizes([...new Set(initialSizes)]);

        if (initialSizes.length > 0) {
          setSelectedSize(initialSizes[0]);
          setQuantity(initialVariant.sizeStock[Object.keys(initialVariant.sizeStock).find(sizeId => sizeIdMap[sizeId] === initialSizes[0])] || 0);
        }
      }
    }
  }, [product.variants, sizeIdMap]);

  useEffect(() => {
    if (selectedColor) {
      const selectedVariant = product.variants.find(variant => variant.attributes.color === selectedColor);

      if (selectedVariant) {
        setVariantImages({
          featuredImage: `${API_URL}/uploads/variants/featured/${selectedVariant.variantFeaturedImage}`,
          galleryImages: selectedVariant.variantGalleryImages.map(image => `${API_URL}/uploads/variants/gallery/${image}`)
        });

        const newSizes = Object.keys(selectedVariant.sizeStock).map(sizeId => sizeIdMap[sizeId] || sizeId);
        setAvailableSizes([...new Set(newSizes)]);

        if (newSizes.length > 0) {
          setSelectedSize(newSizes[0]);
          setQuantity(selectedVariant.sizeStock[Object.keys(selectedVariant.sizeStock).find(sizeId => sizeIdMap[sizeId] === newSizes[0])] || 0);
        }
      }
    }
  }, [selectedColor, product.variants, sizeIdMap]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const selectedVariant = product.variants.find(variant => variant.attributes.color === selectedColor);
      if (selectedVariant) {
        const sizeId = Object.keys(selectedVariant.sizeStock).find(sizeId => sizeIdMap[sizeId] === selectedSize);
        setQuantity(selectedVariant.sizeStock[sizeId] || 0);
      }
    }
  }, [selectedSize, selectedColor, product.variants, sizeIdMap]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return; // Ensure size and color are selected

    // Check the stock for the selected size
    if (quantity === 0) {
      alert('This size is out of stock!');
      return; // Prevent adding to the cart if the selected size is out of stock
    }

    addToCart(product.id, selectedSize, selectedColor);
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
        <div className="productdisplay-left mb-4">
          <SyncedSlider images={images} />
        </div>
        <div className="productdisplay-right d-flex flex-column gap-2 gap-lg-3">
          <h1 className='product-title mb-0 fw-600'>{product.itemName}</h1>
          <p className="product-description mb-0">
            {product.shortDescription || "This is a static description."}
          </p>
          {/* <div className="productdisplay-stars d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-half-fill"></i>
              <i className="ri-star-line"></i>
            </div>
            <p className='mb-0'>(122 Ratings)</p>
          </div> */}
          <div className="productdisplay-stars d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <i
                  key={index}
                  className={`ri-star${index < Math.floor(averageRating) ? '-fill' : index < averageRating ? '-half-fill' : '-line'}`}
                ></i>
              ))}
            </div>
            <p className='mb-0'>({averageRating})</p>
          </div>
          <div className="product-prices d-flex align-items-center gap-4">
            <div className="current-price fw-600">${product.newPrice}</div>
            <div className="old-price text-decoration-line-through">${product.oldPrice}</div>
            <span className='product-discount'>(53% OFF)</span>
          </div>
          <div className="productdisplay-size">
            <ul className="product-sizes mb-0 list-unstyled d-flex align-items-center gap-3">
              {availableSizes.map((size, index) => {
                const sizeId = Object.keys(product.variants.find(variant => variant.attributes.color === selectedColor).sizeStock).find(sizeId => sizeIdMap[sizeId] === size);
                const isOutOfStock = product.variants.find(variant => variant.attributes.color === selectedColor).sizeStock[sizeId] === 0;

                return (
                  <li
                    key={index}
                    className={`size-option ${selectedSize === size ? 'selected' : ''} cursor-pointer d-flex align-items-center justify-content-center ${isOutOfStock && 'out-of-stock'}`}
                    onClick={() => setSelectedSize(size)}
                    style={{ opacity: isOutOfStock ? 0.5 : 1 }}
                  >
                    {size}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="productdisplay-color">
            <div className="selected-color-name mb-2">
              <span>Color: <span>{selectedColor}</span></span>
            </div>
            <ul className="color-options mb-0 list-unstyled d-flex flex-wrap align-items-center gap-3">
              {colorOptions.map((colorOption, index) => (
                <li
                  key={index}
                  className={`color-option cursor-pointer ${selectedColor === colorOption.color ? 'selected' : ''}`}
                  style={{
                    backgroundImage: `url(${API_URL}/uploads/variants/featured/${colorOption.image})`
                  }}
                  onClick={() => setSelectedColor(colorOption.color)}
                >
                </li>
              ))}
            </ul>
          </div>
          <div className="product-quantity">
            {quantity > 0 ? (
              <p className='mb-0 text-success'>{quantity} items available</p>
            ) : (
              <p className='out-of-stock mb-0 text-danger'>out of stock</p>
            )}
          </div>

          <div className='productdisplay-add-btn d-lg-flex align-items-center gap-3'>
            <div
              role="button"
              aria-label="Add to Cart"
              className={`ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-inline-block w-75 text-center ${(!selectedSize || !selectedColor || quantity === 0) ? 'disabled' : ''}`}
              id='addToCart'
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || quantity === 0}
              tabIndex="0"
            >
              Add to cart
            </div>
            <div
              role="button"
              aria-label="Add to Wishlist"
              className="ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-none d-lg-inline-block w-75 text-center"
              tabIndex="0"
            >
              Wishlist
            </div>
          </div>
          <div className="product-buy-now-btn w-100">
            <div
              role="button"
              aria-label="Buy Now"
              className="ff-btn ff-btn-fill-dark text-uppercase text-decoration-none d-inline-block w-100 text-center"
              tabIndex="0"
            >
              Buy Now
            </div>
          </div>
          <div className="payment-info">
            <div className="payment-head">GUARANTEED SAFE CHECKOUT:</div>
            <div className="payment-info-image w-50 mt-2">
              <img src="/images/payment-info.png" alt="Payment Info" className='w-100' />
            </div>
          </div>

          <DescriptionBox description={product.fullDescription} />
        </div>
      </div>
      <Reviews productId={product._id} />
    </>
  );
};

export default ProductDisplay;