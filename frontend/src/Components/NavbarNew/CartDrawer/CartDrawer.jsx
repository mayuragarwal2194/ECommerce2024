import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CartDrawer.css';
import { ShopContext } from '../../../Context/ShopContext';
import { API_URL } from '../../../services/api';

const CartDrawer = ({ isCartOpen, onClose, isSticky }) => {
  const { allProducts, cartItems, addToCart, removeFromCart, deleteFromCart } = useContext(ShopContext);

  const [isMobile, setIsMobile] = useState(false);

  const cartProducts = allProducts.filter((item) => cartItems[item.id] > 0);
  const subtotal = cartProducts.reduce((acc, item) => acc + item.newPrice * cartItems[item.id], 0);

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
    ? (isMobile ? '100dvh' : '100dvh') // Sticky: same height for both mobile and desktop
    : (isMobile ? 'calc(100dvh - 52.4px)' : '100dvh'); // Non-sticky: different height for mobile

  const TopPositionOfDrawer = isSticky
    ? (isMobile ? '0' : '0') // Sticky: same height for both mobile and desktop
    : (isMobile ? '52.4px' : '0');


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

  return (
    <>
      <div className={`cart-drawer text-dark ${isCartOpen ? 'open' : ''}`} style={{ height: drawerHeight, top: TopPositionOfDrawer }}>
        <div className="cart-drawer-header">
          <Link to={'/cart'} onClick={onClose} className='text-dark fw-bold text-uppercase cursor-pointer text-decoration-none'>
            Cart
          </Link>
          <div onClick={onClose} className="close-btn cursor-pointer line-height-normal" aria-label="Close cart drawer">
            <i className="ri-close-large-fill text-dark"></i>
          </div>
        </div>
        <div className="cart-drawer-body">
          {cartProducts.length > 0 ? (
            cartProducts.map((item) => (
              <div key={item.id} className="cart-item align-items-start">
                <div className="cart-item-image">
                  <img
                    src={`${API_URL}/uploads/featured/${item.featuredImage}`}
                    alt={item.itemName || 'Product image'}
                    className='w-100 h-100 object-cover object-position-top'
                  />
                </div>
                <div className="cart-item-details">
                  <h6 className='mb-3'>{item.itemName}</h6>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className="cart-quantity-controls">
                      <button onClick={() => removeFromCart(item.id)} className="decrease-qty-btn bg-transparent border border-end-0">-</button>
                      <span className='cartitems-quantity border-top border-bottom'>{cartItems[item.id]}</span>
                      <button onClick={() => addToCart(item.id)} className="increase-qty-btn bg-transparent border border-start-0">+</button>
                    </div>
                    <p className='mb-0'>${(item.newPrice * cartItems[item.id]).toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={() => deleteFromCart(item.id)} className="delete-btn ms-3 line-height-normal">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className="cart-drawer-footer">
          <div className="total-section">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={onClose}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      {isCartOpen && <div className="cart-overlay" onClick={onClose} style={{ height: drawerHeight, top: TopPositionOfDrawer }}></div>}
    </>
  );
};

export default CartDrawer;