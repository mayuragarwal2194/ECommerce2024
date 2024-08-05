import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';

const CartItems = () => {
  const { allProducts, cartItems, addToCart, removeFromCart, deleteFromCart } = useContext(ShopContext);

  const cartProducts = allProducts.filter((item) => cartItems[item.id] > 0);

  // Calculate subtotal and total
  const subtotal = cartProducts.reduce((acc, item) => acc + item.newPrice * cartItems[item.id], 0);
  const total = subtotal; // Update this value with actual total calculation if needed

  return (
    <div className='cartitems my-5'>
      <div className="container">
        <div className="row cartitems-format-main text-center border-bottom pb-3">
          <div className="col">Products</div>
          <div className="col-3 text-start">Title</div>
          <div className="col">Price</div>
          <div className="col">Quantity</div>
          <div className="col">Total</div>
          <div className="col">Delete</div>
        </div>
        {cartProducts.map((item) => (
          <div key={item.id} className="row align-items-center cart-item text-center">
            <div className="col">
              <img src={`http://localhost:5000${item.image}`} alt={item.itemName} className='carticon-product-image img-fluid' />
            </div>
            <div className="col-3 text-start">{item.itemName}</div>
            <div className="col">${item.newPrice}</div>
            <div className="col">
              <div className="d-flex align-items-center justify-content-center">
                <button className="decrease-qty-btn bg-transparent border border-end-0" onClick={() => removeFromCart(item.id)}>-</button>
                <span className="cartitems-quantity border-top border-bottom">{cartItems[item.id]}</span>
                <button className="increase-qty-btn bg-transparent border border-start-0" onClick={() => addToCart(item.id)}>+</button>
              </div>
            </div>
            <div className="col">${(item.newPrice * cartItems[item.id])}</div>
            <div className="col">
              <button onClick={() => deleteFromCart(item.id)} className="btn btn-link text-danger">
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
            <hr className='my-3' />
          </div>
        ))}
        {/* Cart Total Section */}
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="promoCode" className="form-label cursor-pointer">If you have a promo code, enter it here:</label>
              <div className="d-flex">
                <input type="text" className="form-control" id="promoCode" placeholder="Promo code" />
                <button className="btn btn-outline-secondary promo-apply-btn text-white" type="button">Apply</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="custom-card">
              <div className="card-body">
                <h5 className="card-title">Cart Total</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping Fee</span>
                  <span>Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
                <button className="checkout-btn mt-3 w-100 text-white">Proceed to Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;