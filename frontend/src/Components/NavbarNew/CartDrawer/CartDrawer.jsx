import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CartDrawer.css';
import { useCart } from '../../../Context/cartContext'; // Updated to use the CartContext
import { API_URL } from '../../../services/api';

const CartDrawer = ({ isCartOpen, onClose, isSticky }) => {
  const { cart, removeItemFromCart, getTotalPrice, getFinalPrice, shippingCharges, updateItemQuantity, closeCartDrawer } = useCart(); // Updated to use the CartContext
  const [isMobile, setIsMobile] = useState(false);

  // Function to determine screen size
  const updateScreenSize = () => {
    setIsMobile(window.innerWidth <= 768); // 768px is generally the breakpoint for mobile
  };

  // Call the updateScreenSize function when the component mounts and when window resizes
  useEffect(() => {
    updateScreenSize(); // Initial check
    window.addEventListener('resize', updateScreenSize); // Listen for resize events

    return () => {
      window.removeEventListener('resize', updateScreenSize); // Cleanup the event listener
    };
  }, []);

  // Set drawer height based on screen size and sticky state
  const drawerHeight = isSticky
    ? isMobile
      ? '100dvh'
      : '100dvh'
    : isMobile
      ? 'calc(100dvh - 52.4px)'
      : '100dvh';

  const TopPositionOfDrawer = isSticky
    ? isMobile
      ? '0'
      : '0'
    : isMobile
      ? '52.4px'
      : '0';

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isCartOpen]);

  // Functions to increase and decrease quantity
  const increaseQuantity = (cartId, productId, variantId, quantity, selectedSize, selectedColor) => {
    updateItemQuantity(cartId, productId, variantId, quantity + 1, selectedSize, selectedColor);
  };

  const decreaseQuantity = (cartId, productId, variantId, quantity, selectedSize, selectedColor) => {
    if (quantity > 1) {
      updateItemQuantity(cartId, productId, variantId, quantity - 1, selectedSize, selectedColor);
    }
  };

  return (
    <>
      <div
        className={`cart-drawer text-dark ${isCartOpen ? 'open' : ''}`}
        style={{ height: drawerHeight, top: TopPositionOfDrawer }}
      >
        <div className="cart-drawer-header">
          <Link
            to={'/cart'}
            onClick={onClose}
            className="text-dark fw-bold text-uppercase cursor-pointer text-decoration-none"
          >
            Cart
          </Link>
          <div
            onClick={onClose}
            className="close-btn cursor-pointer line-height-normal"
            aria-label="Close cart drawer"
          >
            <i className="ri-close-large-fill text-dark"></i>
          </div>
        </div>

        <div className="cart-drawer-body">
          {Array.isArray(cart.items) && cart.items.length > 0 ? (
            cart.items.map((item) => {
              console.log('Item Size Stock:', item.sizeStock); // Debugging stock availability

              return (
                <div key={item.variantId} className="cart-item align-items-start">
                  {/* Product Image */}
                  <Link to={`/product/${item.productId}`} onClick={closeCartDrawer}>
                    <div className="cart-item-image">
                      <img
                        src={`${API_URL}/uploads/variants/featured/${item.featuredImage}`}
                        alt={item.itemName || 'Product image'}
                        className="w-100 h-100 object-cover object-position-top"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="cart-item-details">
                    {/* Product Name */}
                    <h6 className="mb-2">{item.itemName}</h6>
                    <p className="text-muted mb-1">Color: {item.color}</p>
                    <p className="text-muted mb-1">Size: {item.size}</p>
                  </div>

                  {/* Quantity Control */}
                  <div className="cart-quantity-controls d-flex align-items-center mb-3">
                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.cartId,
                          item.productId,
                          item.variantId,
                          item.quantity,
                          item.size,
                          item.color
                        )
                      }
                      className="decrease-qty-btn bg-transparent border border-end-0"
                      aria-label="Decrease Quantity"
                      disabled={item.quantity <= 1} // Disable when quantity is 1
                    >
                      -
                    </button>
                    <span
                      className="cartitems-quantity border-top border-bottom border-start-0 border-end-0"
                      aria-label="Selected Quantity"
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.cartId,
                          item.productId,
                          item.variantId,
                          item.quantity,
                          item.size,
                          item.color
                        )
                      }
                      className="increase-qty-btn bg-transparent border border-start-0"
                      aria-label="Increase Quantity"
                      disabled={item.quantity >= item.sizeStock} // Disable when quantity reaches stock
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={() =>
                      removeItemFromCart(item.productId, item.variantId, item.size, item.color)
                    }
                    className="delete-btn ms-3 line-height-normal"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              );
            })
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>


        <div className="cart-drawer-footer">
          <div className="total-section">
            <span>Subtotal</span>
            <span>${cart.totalPrice ? cart.totalPrice.toFixed(2) : '0.00'}</span>
          </div>
          <div className="total-section">
            <span>Shipping</span>
            {/* Shipping charges from context */}
            {/* <span>${shippingCharges}</span> */}
            <span>Calculated at checkout</span>
          </div>
          <div className="total-section">
            <span><strong>Total</strong></span>

            {/* Total with shipping */}
            {/* <span><strong>${getFinalPrice.toFixed(2)}</strong></span> */}
            <span><strong>${getTotalPrice}</strong></span> {/* Total with shipping */}
          </div>
          <button className="checkout-btn" onClick={onClose}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={onClose}
          style={{ height: drawerHeight, top: TopPositionOfDrawer }}
        ></div>
      )}
    </>
  );
};

export default CartDrawer;