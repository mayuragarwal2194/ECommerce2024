import React, { useState } from 'react';

const VariantForm = ({ index, variant, handleVariantChange, handleVariantImageChange }) => {
  return (
    <div className="variant-form">
      <h4>Variant {index + 1}</h4>
      <input
        type="text"
        name="sku"
        placeholder="SKU"
        value={variant.sku}
        onChange={(e) => handleVariantChange(index, e)}
        required
      />
      <input
        type="text"
        name="color"
        placeholder="Color"
        value={variant.attributes.color}
        onChange={(e) => handleVariantChange(index, e, 'color')}
        required
      />
      <input
        type="text"
        name="size"
        placeholder="Size"
        value={variant.attributes.size}
        onChange={(e) => handleVariantChange(index, e, 'size')}
        required
      />
      <input
        type="number"
        name="newPrice"
        placeholder="New Price"
        value={variant.newPrice}
        onChange={(e) => handleVariantChange(index, e)}
        required
      />
      <input
        type="number"
        name="oldPrice"
        placeholder="Old Price"
        value={variant.oldPrice}
        onChange={(e) => handleVariantChange(index, e)}
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={variant.quantity}
        onChange={(e) => handleVariantChange(index, e)}
        required
      />
      <input
        type="file"
        name="variantFeaturedImage"
        onChange={(e) => handleVariantImageChange(index, e, 'variantFeaturedImage')}
      />
      <input
        type="file"
        name="variantGalleryImages"
        multiple
        onChange={(e) => handleVariantImageChange(index, e, 'variantGalleryImages')}
      />
    </div>
  );
};

export default VariantForm;
