// AddToCartButton.js
import React, { useState } from 'react';
import './AddToCartButton.css'

const AddToCartButton = ({
  handleAddToCart,
  loading,
  selectedSize,
  selectedColor,
  availableStock,
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    if (selectedQuantity < availableStock) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= availableStock) {
      setSelectedQuantity(value);
    }
  };

  const isAddToCartDisabled =
    !selectedSize || !selectedColor || availableStock === 0 || loading;

  return (
    <div className="productdisplay-add-btn">
      {/* Quantity Controls */}
      <div className="cart-quantity-controls d-flex align-items-center mb-3">
        <button
          className="decrease-qty-btn bg-transparent border border-end-0"
          onClick={handleDecreaseQuantity}
          disabled={selectedQuantity <= 1}
          aria-label="Decrease Quantity"
        >
          -
        </button>
        <span
          className="cartitems-quantity border-top border-bottom border-start-0 border-end-0"
          aria-label="Selected Quantity"
        >
          {selectedQuantity}
        </span>
        <button
          className="increase-qty-btn bg-transparent border border-start-0"
          onClick={handleIncreaseQuantity}
          disabled={selectedQuantity >= availableStock}
          aria-label="Increase Quantity"
        >
          +
        </button>
      </div>



      {/* Add to Cart Button */}
      <div
        role="button"
        aria-label="Add to Cart"
        className={`ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-inline-block w-75 text-center ${isAddToCartDisabled ? 'disabled' : ''
          }`}
        id="addToCart"
        onClick={() => handleAddToCart(selectedQuantity)} // Pass selectedQuantity here
        disabled={isAddToCartDisabled}
        tabIndex="0"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </div>

    </div>
  );
};

export default AddToCartButton;