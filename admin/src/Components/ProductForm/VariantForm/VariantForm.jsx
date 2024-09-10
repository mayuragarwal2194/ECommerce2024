import React, { useEffect } from 'react';

const VariantForm = ({ availableSizes, variants, setVariants, variantPreviews, setVariantPreviews }) => {

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
    const previewURL = file ? URL.createObjectURL(file) : null;

    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, [field]: file } : variant
      )
    );

    setVariantPreviews((prevPreviews) =>
      prevPreviews.map((preview, i) =>
        i === index
          ? field === 'variantFeaturedImage'
            ? { ...preview, variantFeaturedImagePreview: previewURL }
            : preview
          : preview
      )
    );
  };

  const handleVariantGalleryChange = (index) => (e) => {
    const files = Array.from(e.target.files);
    const previewURLs = files.map(file => URL.createObjectURL(file));

    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, variantGalleryImages: files } : variant
      )
    );

    setVariantPreviews((prevPreviews) =>
      prevPreviews.map((preview, i) =>
        i === index ? { ...preview, variantGalleryImagesPreview: previewURLs } : preview
      )
    );
  };

  const handleSizeChange = (index, sizeId) => (e) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index
          ? {
            ...variant,
            attributes: {
              ...variant.attributes,
              size: e.target.checked
                ? [...variant.attributes.size, sizeId]
                : variant.attributes.size.filter((s) => s !== sizeId),
            },
          }
          : variant
      )
    );
  };

  const handleSizeStockChange = (index, sizeId, value) => {
    setVariants((prevVariants) => prevVariants.map((variant, i) =>
      i === index
        ? { ...variant, sizeStock: { ...variant.sizeStock, [sizeId]: value } }
        : variant
    ));
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
      sizeStock: {}, // Ensure sizeStock is initialized
      variantFeaturedImage: null,
      variantGalleryImages: []
    }]);
    setVariantPreviews([...variantPreviews, {
      variantFeaturedImagePreview: null,
      variantGalleryImagesPreview: []
    }]);
  };

  const removeVariant = (index) => {
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
    setVariantPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  // Clean up object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      variantPreviews.forEach(preview => {
        if (preview.variantFeaturedImagePreview) URL.revokeObjectURL(preview.variantFeaturedImagePreview);
        preview.variantGalleryImagesPreview.forEach(URL.revokeObjectURL);
      });
    };
  }, [variantPreviews]);

  return (
    <div className="w-75 mb-5 pb-5">
      <h4>Variants</h4>
      {variants.map((variant, index) => (
        <div key={index} className="mb-3 border p-3 rounded">
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h5 className='mb-0'>Variant {index + 1}</h5>
            <button type="button" className="btn btn-danger" onClick={() => removeVariant(index)}>
              Remove Variant
            </button>
          </div>
          
          {/* Variant Details (SKU, Price, Quantity, etc.) */}
          <div className="d-flex align-items-center gap-3 mb-3">
            {/* SKU Input */}
            <input type="text" value={variant.sku} onChange={handleVariantChange(index, 'sku')} placeholder="SKU" required />
            <input type="number" value={variant.newPrice} onChange={handleVariantChange(index, 'newPrice')} placeholder="New Price" required />
            <input type="number" value={variant.oldPrice} onChange={handleVariantChange(index, 'oldPrice')} placeholder="Old Price" />
            <input type="number" value={variant.quantity} onChange={handleVariantChange(index, 'quantity')} placeholder="Quantity" required />
          </div>

          {/* Color & Size */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <input type="text" value={variant.attributes.color} onChange={handleVariantChange(index, 'color', true)} placeholder="Color" />

            {/* Size Selection */}
            {availableSizes.map(size => (
              <div key={size._id} className="me-2">
                <label>
                  <input type="checkbox" checked={variant.attributes.size.includes(size._id)} onChange={handleSizeChange(index, size._id)} />
                  {size.sizeName}
                </label>
                {/* Stock Input */}
                {variant.attributes.size.includes(size._id) && (
                  <input type="number" placeholder={`Stock for ${size.sizeName}`} value={variant.sizeStock[size._id] || ''} onChange={(e) => handleSizeStockChange(index, size._id, e.target.value)} />
                )}
              </div>
            ))}
          </div>

          {/* Image Upload & Previews */}
          <div className="d-flex gap-3 mb-3">
            <div className='w-50'>
              <input type="file" onChange={handleVariantFileChange(index, 'variantFeaturedImage')} />
              {variantPreviews[index]?.variantFeaturedImagePreview && (
                <img src={variantPreviews[index]?.variantFeaturedImagePreview} alt="Preview" style={{ width: '100px' }} />
              )}
            </div>

            <div className='w-50'>
              <input type="file" onChange={handleVariantGalleryChange(index)} multiple />
              {variantPreviews[index]?.variantGalleryImagesPreview.map((src, idx) => (
                <img key={idx} src={src} alt="Preview" style={{ width: '50px' }} />
              ))}
            </div>
          </div>
        </div>
      ))}
      
      {/* Add Variant Button */}
      <button type="button" className="btn btn-secondary" onClick={addVariant}>
        Add Variant
      </button>
    </div>
  );
};

export default VariantForm;