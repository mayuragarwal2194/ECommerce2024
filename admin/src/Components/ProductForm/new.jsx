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
          <div>Size</div>
          <div className='w-fit-content d-flex align-items-center gap-3'>
            {availableSizes.map((size) => (
              <label key={size._id} className="me-2 text-uppercase d-flex align-items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  name={`variantSize${index}`}
                  value={size.sizeName} // Use _id for value
                  checked={variant.attributes.size.includes(size._id)} // Check against _id
                  onChange={handleSizeChange(index, size._id)} // Pass _id to handler
                />
                {size.sizeName}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className='w-25'>
        {availableSizes.map((size) => (
          <div key={size._id} className="d-flex flex-column">
            <label className="me-2 text-uppercase d-flex align-items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                name={`variantSize${index}`}
                value={size.sizeName}
                checked={variant.attributes.size.includes(size._id)}
                onChange={handleSizeChange(index, size._id)}
              />
              {size.sizeName}
            </label>

            {variant.attributes.size.includes(size._id) && (
              <input
                type="number"
                placeholder={`Stock for ${size.sizeName}`}
                value={variant.sizeStock[size._id] || ''}
                onChange={(e) => handleSizeStockChange(index, size._id, e.target.value)}
                className="form-control"
              />
            )}
          </div>
        ))}
      </div>
      <div className="d-flex gap-3 mb-3">
        <div className='w-50'>
          <div className='mb-3'>
            <label htmlFor={`variantFeaturedImage-${index}`} className="cursor-pointer d-block mb-1">Variant Featured Image</label>
            <input
              type="file"
              id={`variantFeaturedImage-${index}`}
              onChange={handleVariantFileChange(index, 'variantFeaturedImage')}
              className="form-control"
            />
          </div>
          {variantPreviews[index].variantFeaturedImagePreview && (
            <img src={variantPreviews[index].variantFeaturedImagePreview} alt="Variant Featured Preview" style={{ width: '200px', height: 'auto' }} />
          )}
        </div>
        <div className='w-50'>
          <div className='mb-3'>
            <label htmlFor={`variantGalleryImages-${index}`} className="cursor-pointer d-block mb-1">Variant Gallery Images</label>
            <input
              type="file"
              id={`variantGalleryImages-${index}`}
              onChange={handleVariantGalleryChange(index)}
              multiple
              className="form-control"
            />
          </div>
          <div className='d-flex flex-wrap gap-3'>
            {variantPreviews[index].variantGalleryImagesPreview.map((src, idx) => (
              <img key={idx} src={src} alt={`Variant Gallery Preview ${idx}`} style={{ width: '20%', height: 'auto' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ))}
  <button type="button" className="btn btn-secondary" onClick={addVariant}>
    Add Variant
  </button>
</div>