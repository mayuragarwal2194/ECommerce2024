// ProductImageGallery.js
import React from 'react';
import SyncedSlider from '../../SyncedSlider/SyncedSlider';

const ProductImageGallery = ({ images }) => {
  return (
    <SyncedSlider images={images} />
  );
};

export default ProductImageGallery;