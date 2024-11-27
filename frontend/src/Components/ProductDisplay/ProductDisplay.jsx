import React, { useState, useEffect, useMemo } from 'react';
import './ProductDisplay.css';
import { useCart } from '../../Context/cartContext';
import DescriptionBox from '../DescriptionBox/DescriptionBox';
import { API_URL } from '../../services/api';
import Reviews from '../Reviews/Reviews';
import ProductImageGallery from './ProductImageGallery/ProductImageGallery';
import ProductHeader from './ProductHeader/ProductHeader';
import ProductRating from './ProductRating/ProductRating';
import ProductPrice from './ProductPrice/ProductPrice';
import ProductSizes from './ProductSizes/ProductSizes';
import ProductColors from './ProductColors/ProductColors';
import ProductQuantity from './ProductQuantity/ProductQuantity';
import AddToCartButton from './AddToCartButton/AddToCartButton';
import BuyNowButton from './BuyNowButton/BuyNowButton';
import PaymentInfo from './PaymentInfo/PaymentInfo';


const ProductDisplay = ({ product }) => {
  const { addItemToCart, loading } = useCart();
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


  const images = [
    variantImages.featuredImage,
    ...Array.isArray(variantImages.galleryImages) ? variantImages.galleryImages : []
  ].filter(image => image);

  const colorOptions = product.variants.map((variant) => ({
    color: variant.attributes.color,
    image: variant.variantFeaturedImage,
  }));


  const selectedVariant = useMemo(() => {
    // console.log('Selected Color:', selectedColor);
    // console.log('Selected Size:', selectedSize);
    // console.log('Product Variants:', product.variants);
    // console.log('SizeId Map:', sizeIdMap);

    return product.variants.find((variant) => {
      // console.log('Checking Variant:', variant);
      // console.log('Variant SizeStock:', variant.sizeStock);
      return variant.attributes.color === selectedColor &&
        Object.keys(variant.sizeStock).some(sizeId => {
          // console.log(`Checking sizeId: ${sizeId} against selectedSize: ${selectedSize}`);
          return sizeIdMap[sizeId] === selectedSize;
        });
    });
  }, [selectedColor, selectedSize, product.variants, sizeIdMap]);

  const selectedVariantId = selectedVariant ? selectedVariant._id : null;

  // Check if correct variant is selected
  // console.log("Selected Variant:", selectedVariant);

  // console.log("Selected Variant ID:", selectedVariantId);



  // useEffect(() => {
  //   console.log("Updated selectedSize:", selectedSize);
  //   console.log("Updated selectedColor:", selectedColor);
  //   console.log("Updated selectedVariant:", selectedVariant);
  //   console.log("Updated selectedVariantId:", selectedVariantId);
  // }, [selectedSize, selectedColor, selectedVariant, selectedVariantId]);


  const handleAddToCart = (selectedQuantity) => {
    if (!selectedVariantId || !selectedSize || !selectedColor) {
      alert('Please select a size and color.');
      return;
    }

    const payload = {
      productId: product._id,
      variantId: selectedVariantId,
      quantity: selectedQuantity, // Use the dynamic quantity
      selectedSize,
      selectedColor,
    };

    console.log('Payload for addItemToCart:', payload); // Log to verify the payload

    addItemToCart(
      payload.productId,
      payload.variantId,
      payload.quantity,
      payload.selectedSize,
      payload.selectedColor
    );
  };



  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };




  return (
    <>
      <div className='productdisplay my-4 d-lg-flex align-items-start gap-5'>
        <div className="productdisplay-left mb-4">
          <ProductImageGallery images={images} />
        </div>
        <div className="productdisplay-right d-flex flex-column gap-2 gap-lg-3">
          <ProductHeader product={product} selectedVariantId={selectedVariantId} />
          <ProductRating averageRating={averageRating} />
          <ProductPrice
            newPrice={product.newPrice}
            oldPrice={product.oldPrice}
            discount={calculateDiscount(product.oldPrice, product.newPrice)}
          />
          <ProductSizes
            availableSizes={availableSizes}
            selectedSize={selectedSize}
            sizeStock={product.variants.find(variant => variant.attributes.color === selectedColor)?.sizeStock || {}}
            sizeIdMap={sizeIdMap}
            onSizeSelect={handleSizeSelect}
          />
          <ProductColors
            colorOptions={colorOptions.map((option) => ({
              color: option.color,
              image: `${API_URL}/uploads/variants/featured/${option.image}`,
            }))}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
          <ProductQuantity quantity={quantity} />
          <AddToCartButton
            handleAddToCart={handleAddToCart}
            loading={loading}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            availableStock={quantity}
          />
          <BuyNowButton />
          <PaymentInfo />

          <DescriptionBox description={product.fullDescription} />
        </div>
      </div>
      <Reviews productId={product._id} />
    </>
  );
};

export default ProductDisplay;