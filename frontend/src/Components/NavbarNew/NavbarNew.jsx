import React, { useState, useEffect } from 'react';
import './NavbarNew.css';
import { Link, useLocation } from 'react-router-dom';
// import { ShopContext } from '../../Context/ShopContext';
import { fetchTopCategories, API_URL } from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NavbarNew = () => {
  const [menu, setMenu] = useState('shop');
  const [topCategories, setTopCategories] = useState([]);
  // const { getTotalCartItems } = useContext(ShopContext);
  const [isSticky, setIsSticky] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const location = useLocation();

  const [hoveredMenu, setHoveredMenu] = useState(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/' && window.scrollY > 60) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
    } else {
      setIsReveal(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <div className={`navbar-section inside-banner ${isSticky && location.pathname === '/' ? 'sticky' : ''} ${isReveal && location.pathname !== '/' ? 'reveal' : ''}`}>
      <div className="px-lg-5">
        <nav className='navbarnew d-flex align-items-center justify-content-between p-0'>
          <div className="store-logo-wrapper flex-1">
            <Link to='/' aria-label="Visit FashionFusion Homepage" className="store-logo d-block default-logo">
              <img src={`/images/${isSticky && location.pathname === '/' ? 'logoBlack.png' : 'logoWhite.png'}`} className={`w-100 h-100 ${isReveal && location.pathname !== '/' ? 'd-none' : 'd-inline-block'}`} alt="Logo" />
              <img src="images/logoBlack.png" className={`w-100 h-100 ${isReveal && location.pathname !== '/' ? 'd-inline-block' : 'd-none'}`} alt="Logo" />
            </Link>
            <Link to='/' aria-label="Visit FashionFusion Homepage" className="store-logo d-block hover-logo d-none">
              <img src="images/logoBlack.png" className='w-100 h-100' alt="Logo" />
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
                              {parentCategories && parentCategories.length > 0 && parentCategories.filter(({ showInNavbar }) => showInNavbar).map(({ _id: parentId, name: parentName, children: childCategories, index }) => (
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
              <span className="position-relative">Shop</span>
            </li>
            <li className="nav-item cursor-pointer position-relative">
              <span className="position-relative">About</span>
            </li>
            <li className="nav-item cursor-pointer position-relative">
              <span className="position-relative">Blog</span>
            </li>
          </ul>
          <div className="navbar-right d-flex align-items-center justify-content-end flex-1">
            <div className="dropdown dropdown-hover desktop-dropdown position-relative">
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
              <li className="user-login">
                <Link className="text-decoration-none" to="/login">
                  <i className="ri-user-3-line"></i>
                </Link>
              </li>
              <li className="search desktop-search">
                <i className="ri-search-line"></i>
              </li>
              <li className="cart">
                <Link className="text-decoration-none" to="/cart">
                  <i className="ri-shopping-bag-line"></i>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <ToastContainer />
    </div>
  );
}

export default NavbarNew;
