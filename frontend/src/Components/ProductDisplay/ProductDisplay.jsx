import React, { useContext, useState, useEffect, useMemo } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';
import DescriptionBox from '../DescriptionBox/DescriptionBox';
import { API_URL } from '../../services/api';
import SyncedSlider from '../SyncedSlider/SyncedSlider';
import Reviews from '../Reviews/Reviews';
import WishlistButton from '../Buttons/WishlistButton/WishlistButton';


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
    // console.log("Size ID Map:", map);
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


  const selectedVariant = useMemo(() => {
  console.log('Selected Color:', selectedColor);
  console.log('Selected Size:', selectedSize);  
  console.log('Product Variants:', product.variants);
  console.log('SizeId Map:', sizeIdMap);

  return product.variants.find((variant) => {
    console.log('Checking Variant:', variant);
    console.log('Variant SizeStock:', variant.sizeStock);
    return variant.attributes.color === selectedColor &&
      Object.keys(variant.sizeStock).some(sizeId => {
        console.log(`Checking sizeId: ${sizeId} against selectedSize: ${selectedSize}`);
        return sizeIdMap[sizeId] === selectedSize;
      });
  });
}, [selectedColor, selectedSize, product.variants, sizeIdMap]);

  const selectedVariantId = selectedVariant ? selectedVariant._id : null;
  console.log("Selected Variant:", selectedVariant); // Check if correct variant is selected
  console.log("Selected Variant ID:", selectedVariantId);



  useEffect(() => {
    console.log("Updated selectedSize:", selectedSize);
    console.log("Updated selectedColor:", selectedColor);
    console.log("Updated selectedVariant:", selectedVariant);
    console.log("Updated selectedVariantId:", selectedVariantId);
  }, [selectedSize, selectedColor, selectedVariant, selectedVariantId]);


  return (
    <>
      <div className='productdisplay my-4 d-lg-flex align-items-start gap-5'>
        <div className="productdisplay-left mb-4">
          <SyncedSlider images={images} />
        </div>
        <div className="productdisplay-right d-flex flex-column gap-2 gap-lg-3">
          <div className='d-flex gap-5 align-items-start'>
            <div>
              <h1 className='product-title mb-0 fw-600'>{product.itemName}</h1>
              <p className="product-description mb-0">
                {product.shortDescription || "This is a static description."}
              </p>
            </div>
            <div className='d-flex gap-3'>
              <div className='pd-btn pd-wish-btn d-flex align-items-center justify-content-center rounded-circle'>
                <WishlistButton product={product} variantId={selectedVariantId} />
              </div>
              <div className='pd-btn pd-share-btn d-flex align-items-center justify-content-center rounded-circle'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={`22px`} fill="currentColor"><path d="M13.1202 17.0228L8.92129 14.7324C8.19135 15.5125 7.15261 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.15255 8 8.19125 8.48746 8.92118 9.26746L13.1202 6.97713C13.0417 6.66441 13 6.33707 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6C21 8.20914 19.2091 10 17 10C15.8474 10 14.8087 9.51251 14.0787 8.73246L9.87977 11.0228C9.9583 11.3355 10 11.6629 10 12C10 12.3371 9.95831 12.6644 9.87981 12.9771L14.0788 15.2675C14.8087 14.4875 15.8474 14 17 14C19.2091 14 21 15.7909 21 18C21 20.2091 19.2091 22 17 22C14.7909 22 13 20.2091 13 18C13 17.6629 13.0417 17.3355 13.1202 17.0228ZM6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14ZM17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8ZM17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z"></path></svg>
              </div>
            </div>
          </div>
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
          </div>
          <div className="product-buy-now-btn w-100">
            <div
              role="button"
              aria-label="Buy Now"
              className="ff-btn ff-btn-fill-dark text-uppercase text-decoration-none d-inline-block w-75 text-center"
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