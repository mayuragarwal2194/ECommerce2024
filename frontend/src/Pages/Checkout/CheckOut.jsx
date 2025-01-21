import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Required to get the auth token
import { useCart } from '../../Context/cartContext';
import { API_URL, applyCoupon, removeCoupon } from '../../services/api';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

const CheckOut = () => {

  const { cart, getTotalPrice, updateCart } = useCart(); // Cart details
  const [isLoading, setIsLoading] = useState(false);


  // State to store user profile data
  const [userProfile, setUserProfile] = useState({
    name: 'Customer Name',
    email: 'customer@example.com',
    profilePicture: 'images/default-profile.png',
  });

  const [defaultAddress, setDefaultAddress] = useState(null);

  // **New States for Coupon**
  const [promoCode, setPromoCode] = useState(cart?.coupon?.code || '');
  const [discount, setDiscount] = useState(cart?.coupon?.discountAmount || 0);
  const [finalTotal, setFinalTotal] = useState(cart?.finalTotal || getTotalPrice);
  const [couponMessage, setCouponMessage] = useState(null);

  // UseEffect to sync the discount with cart updates
  useEffect(() => {
    // Sync state with cart data from backend
    setDiscount(cart?.coupon?.discountAmount || 0);
    setFinalTotal(cart?.finalTotal || getTotalPrice);
    setPromoCode(cart?.coupon?.code || ''); // Pre-fill promo code input box
    setCouponMessage(
      cart?.coupon?.code
        ? `Coupon "${cart.coupon.code}" applied successfully!`
        : null
    ); // Show a success message if a coupon is applied
  }, [cart, getTotalPrice]);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) return;

        // Fetch user profile
        const profileResponse = await fetch(`${API_URL}/api/v1/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profileData = await profileResponse.json();

        // Update user profile state
        setUserProfile({
          name: profileData.username || 'User Name',
          email: profileData.email || 'User Email',
          profilePicture: profileData.profilePicture
            ? `${profileData.profilePicture}`
            : 'images/default-profile.png',
        });

        // Check if the user has a default address
        if (profileData.defaultAddress) {
          // Fetch the default address by ID
          const addressResponse = await fetch(`${API_URL}/api/v1/delivery-info/${profileData.defaultAddress}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!addressResponse.ok) {
            throw new Error('Failed to fetch default address');
          }

          const addressData = await addressResponse.json();
          setDefaultAddress(addressData); // Update default address state
        } else {
          console.warn('No default address found for the user');
        }
      } catch (error) {
        console.error('Error fetching user profile or default address:', error);
      }
    };

    fetchUserProfile();
  }, []);


  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Generate Razorpay order ID
      const response = await fetch(`${API_URL}/api/v1/payment/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('authToken')}`,
        },
        body: JSON.stringify({ amount: finalTotal * 100 }), // Amount in paise
      });

      if (!response.ok) {
        throw new Error('Failed to initiate checkout. Please try again.');
      }

      console.log(response);


      const { order, key } = await response.json();

      if (!key) {
        throw new Error('Razorpay key is missing in the response');
      }

      // Trigger Razorpay Checkout
      const options = {
        key, // Use the key from backend
        amount: order.amount, // Amount in paise
        currency: order.currency, // INR
        name: 'Marwar Shop',
        description: 'Test Transaction',
        order_id: order.id, // Order ID from backend
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${API_URL}/api/v1/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('authToken')}`, // Include token for verification
              },
              body: JSON.stringify(response), // razorpay_payment_id, razorpay_order_id, razorpay_signature
            });

            const verifyResult = await verifyResponse.json();
            if (verifyResult.success) {
              alert('Payment successful!');
              window.location.href = '/thank-you';
            } else {
              alert('Payment verification failed.');
            }
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError);
            alert('Error verifying payment. Please contact support.');
          }
        },
        prefill: {
          name: userProfile.name,
          email: userProfile.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      /* global Razorpay */
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      alert(error.message || 'Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const navigate = useNavigate();

  const handleUseDifferentAddress = () => {
    // Check if already on the Profile page
    if (window.location.pathname === '/profile') {
      // Update active tab directly if on the Profile page
      window.updateActiveTab && window.updateActiveTab('Saved Address');
    } else {
      // Navigate to the Profile page with state to open "Saved Address"
      navigate('/profile', { state: { openTab: 'Saved Address' } });
    }
  };

  const handleApplyCoupon = async () => {
    setCouponMessage(null); // Clear previous messages
    if (!promoCode) {
      setCouponMessage('Please enter a promo code.');
      return;
    }

    try {
      const data = await applyCoupon(promoCode);
      const { discountAmount, finalTotal: updatedTotal } = data;

      setDiscount(discountAmount); // Update discount amount
      setFinalTotal(updatedTotal); // Update final total
      setCouponMessage('Coupon applied successfully!');

      // Update the cart state with applied coupon info
      updateCart({ coupon: { code: promoCode, discountAmount }, finalTotal: updatedTotal });
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponMessage(error.message || 'Failed to apply coupon.');
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponMessage(null); // Clear previous messages

    try {
      const data = await removeCoupon(); // Call the API to remove the coupon
      const { finalTotal: updatedTotal } = data;

      setDiscount(0); // Reset the discount amount
      setFinalTotal(updatedTotal); // Update final total to the original amount
      setCouponMessage('Coupon removed successfully!');

      // Update the cart state to remove coupon info
      updateCart({ coupon: null, finalTotal: updatedTotal });
    } catch (error) {
      console.error('Error removing coupon:', error);
      setCouponMessage(error.message || 'Failed to remove coupon.');
    }
  };




  return (
    <>
      <div className="checkout-page container section-padding">
        <div className="d-flex gap-5">
          <div className="checkout-left border-end pe-5">
            {/* User Details */}
            <div className="mb-3">
              <h6>Account</h6>
              <p className="mb-0 user-profile-email">{userProfile.email}</p>
            </div>
            <div className="mb-3">
              <h6>Ship To</h6>
              {defaultAddress ? (
                <div className="default-address">
                  <div>{defaultAddress.fullName}, {defaultAddress.addressLine1}, {defaultAddress.addressLine2}</div>
                  <p>
                    {defaultAddress.townCity}, {defaultAddress.state}{' '}
                    {defaultAddress.pinCode}, {defaultAddress.country}
                  </p>
                  <p>Contact: {defaultAddress.mobileNumber}</p>
                </div>
              ) : (
                <p>No default address found. Please add one.</p>
              )}
              <div className="border-bottom pb-3 cursor-pointer user-select-none" onClick={handleUseDifferentAddress}>
                + Use a Different Address
              </div>
            </div>
            <div className="mb-3">
              <h5 className="fw-bold">Payment</h5>
              <p>All transactions are secure and encrypted.</p>
              <div className="paymentmode-card d-flex flex-column align-items-center gap-4 w-90 border rounded">
                <div className="paymentmode-card-top d-flex align-items-center justify-content-between w-100 px-3 py-3 border">
                  <small>Razorpay Secure (UPI, Cards, Wallets, NetBanking)</small>
                  <div className="payment-mode-images d-flex gap-2">
                    <img src="/images/payments/upi.svg" alt="" />
                    <img src="/images/payments/visa.svg" alt="" />
                    <img src="/images/payments/mastercard.svg" alt="" />
                    <img src="/images/payments/netbanking.svg" alt="" />
                    <small className="border rounded d-flex align-items-center justify-content-center">+6</small>
                  </div>
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-252.3 356.1 163 80.9" className="web-svg">
                    <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2" d="M-108.9 404.1v30c0 1.1-.9 2-2 2H-231c-1.1 0-2-.9-2-2v-75c0-1.1.9-2 2-2h120.1c1.1 0 2 .9 2 2v37m-124.1-29h124.1"></path>
                    <circle cx="-227.8" cy="361.9" r="1.8" fill="currentColor"></circle>
                    <circle cx="-222.2" cy="361.9" r="1.8" fill="currentColor"></circle>
                    <circle cx="-216.6" cy="361.9" r="1.8" fill="currentColor"></circle>
                    <path fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2" d="M-128.7 400.1H-92m-3.6-4.1 4 4.1-4 4.1"></path>
                  </svg>
                </div>
                <p className="w-50 text-center">
                  After clicking “Pay now”, you will be redirected to Razorpay Secure (UPI, Cards, Wallets, NetBanking) to complete your purchase securely.
                </p>
              </div>
            </div>
            {/* Pay Now Button */}
            <button
              className="ff-btn ff-btn-fill-dark discover-btn text-uppercase text-decoration-none d-block w-100 m-auto xs-small-fonts"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
          <div className="checkout-right">
            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <ul>
                {cart.items.map((item) => (
                  <li key={item.variantId} className="d-flex justify-content-between mb-3">
                    <div className="d-flex gap-3">
                      <div className="product-image border rounded position-relative">
                        <img
                          src={`${API_URL}/uploads/variants/featured/${item.featuredImage}`}
                          alt={item.itemName || 'Product image'}
                          className="w-100 h-100 object-cover object-position-top rounded"
                        />
                        <span className="d-flex align-items-center justify-content-center rounded-circle text-white position-absolute">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <div>{item.itemName} - {item.color}</div>
                        <div>{item.size}</div>
                        <font size="2">Get it by <font size="3" className="text-success">Tuesday, 14 January</font></font>
                      </div>
                    </div>
                    <p>₹ {(item.quantity * item.newPrice).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="my-3">
                {cart?.coupon?.code ? (
                  // Show coupon code with "Remove" icon if a coupon is applied
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success me-2">
                      Coupon "{cart.coupon.code}" applied
                    </span>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleRemoveCoupon}
                    >
                      <i className="bi bi-x-lg"></i> Remove
                    </button>
                  </div>
                ) : (
                  // Show input box and "Apply" button if no coupon is applied
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control me-3"
                      id="promoCode"
                      placeholder="Discount code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {couponMessage && (
                <p className={`text-${couponMessage.includes('successfully') ? 'success' : 'danger'}`}>
                  {couponMessage}
                </p>
              )}
              <ul>
                <li className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹ {getTotalPrice.toFixed(2)}</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </li>
                {discount > 0 && (
                  <li className="d-flex justify-content-between">
                    <span>Discount:</span>
                    <span>-₹ {discount.toFixed(2)}</span>
                  </li>
                )}
                <li className="d-flex justify-content-between border-top mt-3 pt-3">
                  <span>Total:</span>
                  <span>₹ {finalTotal.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default CheckOut