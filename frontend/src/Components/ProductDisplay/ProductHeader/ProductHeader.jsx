// ProductHeader.js
import React from 'react';
import WishlistButton from '../../Buttons/WishlistButton/WishlistButton';

const ProductHeader = ({ product, selectedVariantId }) => {
  return (
    <div className="d-flex gap-5 align-items-start">
      <div>
        <h1 className="product-title mb-0 fw-600">{product.itemName}</h1>
        <p className="product-description mb-0">
          {product.shortDescription || 'This is a static description.'}
        </p>
      </div>
      <div className="d-flex gap-3">
        <div className="pd-btn pd-wish-btn d-flex align-items-center justify-content-center rounded-circle">
          <WishlistButton product={product} variantId={selectedVariantId} />
        </div>
        <div className="pd-btn pd-share-btn d-flex align-items-center justify-content-center rounded-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22px"
            fill="currentColor"
          >
            <path d="M13.1202 17.0228L8.92129 14.7324C8.19135 15.5125 7.15261 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.15255 8 8.19125 8.48746 8.92118 9.26746L13.1202 6.97713C13.0417 6.66441 13 6.33707 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6C21 8.20914 19.2091 10 17 10C15.8474 10 14.8087 9.51251 14.0787 8.73246L9.87977 11.0228C9.9583 11.3355 10 11.6629 10 12C10 12.3371 9.95831 12.6644 9.87981 12.9771L14.0788 15.2675C14.8087 14.4875 15.8474 14 17 14C19.2091 14 21 15.7909 21 18C21 20.2091 19.2091 22 17 22C14.7909 22 13 20.2091 13 18C13 17.6629 13.0417 17.3355 13.1202 17.0228ZM6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14ZM17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8ZM17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;