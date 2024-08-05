import React, { useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import payment_info_img from '../Assets/payment-info.png';
import { ShopContext } from '../../Context/ShopContext';
import DescriptionBox from '../DescriptionBox/DescriptionBox';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  // Dynamic rendering for product images
  const imageList = product.galleryImages.map((image, index) => (
    <img key={index} src={`http://localhost:5000/uploads/gallery/${image}`} alt={`Gallery image ${index}`} />
  ));

  return (
    <>
      <div className='productdisplay my-4 d-flex align-items-start gap-5'>
        <div className="productdisplay-left d-flex align-items-start gap-3">
          <div className="productdisplay-img-list d-flex align-items-center justify-content-between flex-column gap-3">
            <img src={`http://localhost:5000/uploads/featured/${product.featuredImage}`} alt="Featured" className='productdisplay-main-img' />
            {imageList}
          </div>
          <div className="productdisplay-img">
            <img src={`http://localhost:5000/uploads/featured/${product.featuredImage}`} alt="Featured" className='productdisplay-main-img' />
          </div>
        </div>
        <div className="productdisplay-right d-flex flex-column gap-3">
          <h1 className='product-title mb-0 fw-600'>{product.itemName}</h1>
          <p className="product-description mb-0">
            {product.shortDescription || "This is a static description. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure officia debitis vero consequuntur dolorum sapiente id, incidunt distinctio vitae repellat doloremque ea."}
          </p>
          <div className="productdisplay-stars d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              <img src={star_icon} alt="Star icon" />
              <img src={star_icon} alt="Star icon" />
              <img src={star_icon} alt="Star icon" />
              <img src={star_icon} alt="Star icon" />
              <img src={star_dull_icon} alt="Star dull icon" />
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
              {product.availableSizes && product.availableSizes.map((size, index) => (
                <li key={index} className='d-flex align-items-center justify-content-center cursor-pointer'>
                  {size}
                </li>
              ))}
            </ul>
          </div>
          <div className='productdisplay-add-btn d-flex align-items-center gap-3'>
            {/* <BTN_FILL_RED btn_name={`Add To Cart`}  /> */}
            <div role="button" className="ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-inline-block w-75 text-center" onClick={handleAddToCart}>Add to cart</div>
            <div role="button" className="ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-inline-block w-75 text-center">Wishlist</div>
          </div>
          <div className="product-buy-now-btn w-100">
            <div role="button" className="ff-btn ff-btn-fill-dark text-uppercase text-decoration-none d-inline-block w-100 text-center">Buy Now</div>
          </div>
          <div className="payment-info">
            <div className="payment-head">GUARANTEED SAFE CHECKOUT:</div>
            <div className="payment-info-image w-50 mt-2">
              <img src={payment_info_img} alt="Payment Info" className='w-100' />
            </div>
          </div>
        </div>
      </div>
      <DescriptionBox description={product.fullDescription} />
    </>
  );
};

export default ProductDisplay;