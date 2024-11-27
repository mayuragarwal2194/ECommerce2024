import React, { useState, useEffect } from 'react';
import './NavbarNew.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchTopCategories, API_URL } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hamburger from './Hamburger/Hamburger';
import { useCart } from '../../Context/cartContext';
import { isAuthenticated } from '../Utils/utils';
import Cookies from 'js-cookie';
import { useWishlist } from '../../Context/WishlistContext';


const NavbarNew = ({ isSticky }) => {
  const [menu, setMenu] = useState('shop');
  const [topCategories, setTopCategories] = useState([]);
  const location = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const { getTotalCartItems, toggleCartDrawer, cart } = useCart();
  const { wishlistCount } = useWishlist();
  const [userData, setUserData] = useState({ name: '', email: '' });

  const navigate = useNavigate();

  const goToWishlist = () => {
    navigate('/profile', { state: { openTab: 'Wishlist' } });
  };

  useEffect(() => {
    // Assuming you have a token stored in cookies
    const token = Cookies.get('authToken');
    if (token) {
      fetch(`${API_URL}/api/v1/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(data => {
          // console.log(data);

          setUserData({
            ...data,
            name: data.username,
            email: data.email,
            profilePicture: data.profilePicture
          });
        })
        .catch(err => console.error('Error fetching user data:', err));
    }
  }, []);


  const fetchCategories = async () => {
    try {
      const topCats = await fetchTopCategories();
      setTopCategories(topCats);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={`navbar-section inside-banner ${location.pathname === '/' ? 'position-absolute' : 'position-relative'} ${location.pathname !== '/' && 'notHomeCss'} ${isSticky ? 'sticky' : ''}`}>
      <div className="px-12 px-lg-5">
        <nav className='navbarnew d-none d-lg-flex align-items-center justify-content-between p-0'>
          <div className="store-logo-wrapper flex-1">
            <Link to='/' aria-label="Visit FashionFusion Homepage" className="store-logo d-block default-logo">
              <img
                src={`/images/${isSticky || (location.pathname !== '/') ? 'logoBlack.png' : 'logoWhite.png'}`}
                className={`w-100 h-100`}
                alt="Logo"
              />
            </Link>
          </div>
          <ul className="desktop-menu letter-216 d-flex align-items-center list-unstyled mb-0">
            {topCategories
              .filter(({ showInNavbar }) => showInNavbar)
              .map(({ _id: topId, name, topImage, children: parentCategories }) => {
                const lowerCaseName = name.toLowerCase();
                return (
                  <li
                    key={topId}
                    onClick={() => {
                      setMenu(lowerCaseName);
                      setHoveredMenu(null); // Hide the dropdown on click
                    }}
                    onMouseEnter={() => setHoveredMenu(lowerCaseName)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    className={`nav-item ${menu === lowerCaseName ? 'active' : ''}`}
                  >
                    <Link className="text-decoration-none text-capitalize" to={`/${lowerCaseName}`}>
                      <span>{name}</span>
                    </Link>
                    <div className="dropdown-content mega-menu px-lg-4" style={{ display: hoveredMenu === lowerCaseName ? 'block' : 'none' }}>
                      <div className="">
                        <div className="d-flex gap-3">
                          <div className="w-50">
                            <div className="d-inline-flex flex-column flex-wrap max-h-300 gap-3">
                              {parentCategories && parentCategories.length > 0 && parentCategories.filter(({ showInNavbar }) => showInNavbar).map(({ _id: parentId, name: parentName, children: childCategories }) => (
                                <div className="w-fit-content" key={parentId}>
                                  <div className="mega-navs pe-2 h-100">
                                    <Link to={`/parentcat/${parentId}`} className="mega-nav nav-currency d-flex align-items-center gap-2 px-0 text-uppercase parent-category fw-bold active mb-3">
                                      {parentName}
                                    </Link>
                                    {childCategories && childCategories.length > 0 && childCategories
                                      .filter(({ showInNavbar }) => showInNavbar)
                                      .map(({ _id: childId, name: childName }) => (
                                        <Link to={`/childcat/${childId}`} key={childId} className="mega-nav px-0 child-category fw-500 text-uppercase mb-1">
                                          {childName}
                                        </Link>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="w-50">
                            <div className="d-flex gap-3">
                              <div className="every-section">
                                <Link to={`/${lowerCaseName}`} className='mega-image-link position-relative h-100'>
                                  <img src={`${API_URL}/${topImage}`} alt="" className='w-100 h-100 object-cover every-image' />
                                  <div className="img-overlay position-absolute w-100 h-100">
                                    <div className="topCat-name text-white position-absolute text-uppercase fw-bold">
                                      <div className='everything-text fw-normal mt-5'>Everything For</div>
                                      {name}
                                      <div className='explore-btn border border-1 border-white rounded w-fit-content m-auto px-3 py-1 text-white mt-3'>Explore</div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                              <div className="">
                                <div>
                                  <h5 className='fw-bold text-uppercase'>Our Special Offerings</h5>
                                  <div className="d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                    {parentCategories.filter(parent => parent.megaMenu).map(parent => (
                                      <div className='mega-collection' key={parent._id}>
                                        <Link to={`/parentcat/${parent._id}`} className='mega-image-link position-relative'>
                                          <img src={`${API_URL}/${parent.parentImage}`} alt="" className='w-100 h-100 object-cover ' />
                                          <div className="mega-collection-name text-white position-absolute text-uppercase fw-bold">
                                            {parent.name}
                                          </div>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className='mt-4'>
                                  <h5 className='fw-bold text-uppercase'>Tranding Collections</h5>
                                  <div className="d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                    {parentCategories
                                      .flatMap(parent => parent.children.filter(child => child.megaMenu))
                                      .map(child => (
                                        <div className='mega-collection-child' key={child._id}>
                                          <Link to={`/childcat/${child._id}`} className='mega-image-link mega-childImg-link position-relative text-center'>
                                            <img src={`${API_URL}/${child.childImage}`} alt="" className='w-100 h-100 object-cover ' />
                                            <div className="mega-collection-child-name text-white position-absolute text-uppercase fw-bold">
                                              {child.name}
                                            </div>
                                          </Link>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            <li className="nav-item cursor-pointer position-relative">
              <Link to={'/'} className='text-decoration-none'>
                <span className="position-relative">Shop</span>
              </Link>
            </li>
            <li className="nav-item cursor-pointer position-relative">
              <Link to={'/'} className='text-decoration-none'>
                <span className="position-relative">About</span>
              </Link>
            </li>
            <li className="nav-item cursor-pointer position-relative">
              <Link to={'/'} className='text-decoration-none'>
                <span className="position-relative">Blog</span>
              </Link>
            </li>
            <li className="nav-item cursor-pointer position-relative">
              <Link to={'/contact'} className='text-decoration-none'>
                <span className="position-relative">Contact</span>
              </Link>
            </li>
          </ul>
          <div className="navbar-right d-flex align-items-center justify-content-end flex-1">
            <div className="dropdown dropdown-hover country-dropdown desktop-dropdown position-relative">
              <button className="dropbtn border-0 bg-transparent">
                Country
                <i className="ri-arrow-down-s-line"></i>
              </button>
              <div className="dropdown-content ps-3 py-3">
                <div className='d-flex flex-column gap-2'>
                  <a href="#service1">
                    <div className="nav-currency d-flex align-items-center gap-2">
                      <img src="./Icons/us.svg" alt="" />
                      <div className="nav-item">USD $</div>
                    </div>
                  </a>
                  <a href="#service2">Service 2</a>
                  <a href="#service3">Service 3</a>
                </div>
              </div>
            </div>
            <ul className="nav-icons d-flex align-items-center justify-content-between list-unstyled mb-0">
              <li className="dropdown dropdown-hover user-dropdown desktop-dropdown position-relative">
                <button className="dropbtn border-0 bg-transparent">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                    className="icon icon-user user-icon"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                  >
                    <title>account</title>
                    <path
                      d="M35 39.84v-2.53c3.3-1.91 6-6.66 6-11.41 0-7.63 0-13.82-9-13.82s-9 6.19-9 13.82c0 4.75 2.7 9.51 6 11.41v2.53c-10.18.85-18 6-18 12.16h42c0-6.19-7.82-11.31-18-12.16Z"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="4"
                    />
                  </svg>
                </button>
                <div className="dropdown-content py-3">
                  <div className='d-flex flex-column gap-2'>
                    {isAuthenticated() ? (
                      <div className='if-logged-in-only'>
                        <div className='d-flex align-items-center gap-3 mb-3 px-3'>
                          <div className='nav-user-profile'>
                            <img
                              src={
                                userData.profilePicture && userData.profilePicture.startsWith('http')
                                  ? userData.profilePicture
                                  : userData.profilePicture && !userData.profilePicture.includes('default-profile.png')
                                    ? `${API_URL}/${userData.profilePicture}`
                                    : 'images/default-profile.png'
                              }
                              onError={(e) => {
                                e.target.src = 'images/default-profile.png';
                              }}
                              alt="User Profile"
                              className='rounded-circle w-100 h-100 object-cover object-position-top'
                            />
                          </div>
                          <div>
                            <div className='fw-bold fs-6'>{userData.name || 'User Name'}</div>
                            <div>{userData.email || 'User Email'}</div>
                          </div>
                        </div>
                        <Link
                          to={'/profile'}
                          className='fs-6 d-flex align-items-center gap-2 border-top py-2 px-3'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M20 22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
                          </svg>
                          Your Profile
                        </Link>
                        <a
                          href="#service2"
                          className='fs-6 d-flex align-items-center gap-2 border-top py-2 px-3'
                          onClick={() => {
                            Cookies.remove('authToken'); // Clear the auth token
                            Cookies.remove('g_state'); // Clear the Google state cookie if it exists
                            window.location.reload(); // Refresh the page

                            // Optional: Revoke the Google session
                            window.open('https://accounts.google.com/Logout', '_blank');
                          }}

                        >
                          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-bA-DUxO">
                            <path d="M2 1h8v2H4v18h6v2H2V1z" fill="currentColor"></path>
                            <path d="M19.586 13H6v-2h13.586l-5.293-5.293 1.414-1.414 7 7a1 1 0 010 1.414l-7 7-1.414-1.414L19.586 13z" fill="currentColor"></path>
                          </svg>
                          Logout
                        </a>
                      </div>
                    ) : (
                      <Link to={'/login'} className='fs-6 px-3 py-2'>
                        Login
                      </Link>
                    )}

                  </div>
                </div>
              </li>
            </ul>
            <ul className="nav-icons search-cart d-flex align-items-center justify-content-between list-unstyled mb-0">
              <li className="search desktop-search">
                <Link to={'/'}>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                    className="icon icon-search search-icon"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                  >
                    <title>icon-search</title>
                    <path
                      d="M47.16 28.58A18.58 18.58 0 1 1 28.58 10a18.58 18.58 0 0 1 18.58 18.58ZM54 54 41.94 42"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="4"
                    />
                  </svg>
                </Link>
              </li>
              <li className="wishlist cursor-pointer position-relative" onClick={goToWishlist}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <title>icon-wishlist</title>
                  <path
                    d="M12 4.95276C9.55556 -0.930046 1 -0.303473 1 7.21544C1 14.7343 12 21 12 21C12 21 23 14.7343 23 7.21544C23 -0.303473 14.4444 -0.930046 12 4.95276Z"
                    stroke="currentcolor"
                    strokeOpacity="0.9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <div className="wishlist-count rounded-circle d-flex align-items-center justify-content-center position-absolute">
                  {wishlistCount}
                </div>
              </li>
              <li className="cart">
                <button
                  className="text-decoration-none cart-button"
                  onClick={toggleCartDrawer}
                  aria-label="Toggle cart drawer"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    role="presentation"
                    className="icon icon-bag-minimal"
                    id="cart-icon"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                  >
                    <title>icon-bag-minimal</title>
                    <path
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="3"
                      d="M11.375 17.863h41.25v36.75h-41.25z"
                    />
                    <path
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="3"
                      d="M22.25 18c0-7.105 4.35-9 9.75-9s9.75 1.895 9.75 9"
                    />
                  </svg>

                  {/* Display cart item count badge */}
                  {Array.isArray(cart.items) && cart.items.length > 0 && (
                    <span
                      className="cart-count rounded-circle d-flex align-items-center justify-content-center position-absolute"
                    >
                      {cart.items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <nav className='mobile-menu d-flex align-items-center d-lg-none py-12'>
          <Hamburger />
          <div className="store-logo-wrapper">
            <Link to='/' aria-label="Visit FashionFusion Homepage" className="store-logo d-block default-logo">
              <img
                src={`/images/${isSticky || (location.pathname !== '/') ? 'logoBlack.png' : 'logoWhite.png'}`}
                className={`w-100 h-100`}
                alt="Logo"
              />
            </Link>
          </div>
          <ul className="nav-icons d-flex align-items-center justify-content-end list-unstyled mb-0 flex-1 gap-3">
            <li className="user-login">
              <Link
                to={isAuthenticated() ? '/profile' : '/login'}
                className="border-0 bg-transparent text-decoration-none"
                aria-label="Login Here"
                role="button"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  className="icon icon-user user-icon"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                >
                  <title>account</title>
                  <path
                    d="M35 39.84v-2.53c3.3-1.91 6-6.66 6-11.41 0-7.63 0-13.82-9-13.82s-9 6.19-9 13.82c0 4.75 2.7 9.51 6 11.41v2.53c-10.18.85-18 6-18 12.16h42c0-6.19-7.82-11.31-18-12.16Z"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="3"
                  />
                </svg>
              </Link>
            </li>
            <li className="cart">
              <button
                className="text-decoration-none cart-button"
                onClick={toggleCartDrawer}
                aria-label="Toggle cart drawer"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  className="icon icon-bag-minimal"
                  id="cart-icon"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                >
                  <title>icon-bag-minimal</title>
                  <path
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="3"
                    d="M11.375 17.863h41.25v36.75h-41.25z"
                  />
                  <path
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="3"
                    d="M22.25 18c0-7.105 4.35-9 9.75-9s9.75 1.895 9.75 9"
                  />
                </svg>

                {/* Display cart item count badge */}
                {Array.isArray(cart.items) && cart.items.length > 0 && (
                  <span
                    className="cart-count rounded-circle d-flex align-items-center justify-content-center position-absolute"
                  >
                    {cart.items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </li>

          </ul>
        </nav>
      </div>

    </div>
  );
}

export default NavbarNew;
