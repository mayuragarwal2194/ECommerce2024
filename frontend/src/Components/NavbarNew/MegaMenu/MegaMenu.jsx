import React from 'react';
import { Link } from 'react-router-dom';

const MegaMenu = ({ subcategories }) => {
  return (
    <div className="dropdown-content mega-menu w-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <div className="mega-navs">
              {subcategories.map((sub) => (
                <Link key={sub._id} to={`/${sub.name.toLowerCase()}`} className="mega-nav text-uppercase">
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="col-md-7">
            <div className="row row-cols-1 row-cols-md-3 g-4 mega-row">
              <div className="col">
                <a href="#arrival" className="mega-card">
                  <div>
                    <div className="card-image w-100 position-relative">
                      <img
                        src="./images/suits.webp"
                        className="w-100 h-100 object-cover"
                        alt=""
                      />
                      <div className="best-seller-tag text-uppercase position-absolute">
                        Best Seller
                      </div>
                    </div>
                    <div className="card-body text-center mt-3 letter-216">
                      <h6 className="product-title">
                        Le Dalia Ivory Liégé
                      </h6>
                      <div className="product-price">$ 380</div>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col">
                <a href="#arrival" className="mega-card">
                  <div>
                    <div className="card-image w-100">
                      <img
                        src="./images/suits.webp"
                        className="w-100 h-100 object-cover"
                        alt=""
                      />
                    </div>
                    <div className="card-body text-center mt-3 letter-216">
                      <h6 className="product-title">
                        Le Dalia Ivory Liégé
                      </h6>
                      <div className="product-price">$ 380</div>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col">
                <a href="#arrival" className="mega-card">
                  <div>
                    <div className="card-image w-100 position-relative">
                      <img
                        src="./images/suits.webp"
                        className="w-100 h-100 object-cover"
                        alt=""
                      />
                      <div className="best-seller-tag text-uppercase position-absolute">
                        Best Seller
                      </div>
                    </div>
                    <div className="card-body text-center mt-3 letter-216">
                      <h6 className="product-title">
                        Le Dalia Ivory Liégé
                      </h6>
                      <div className="product-price">$ 380</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="col-3">
            <a href="#arrival" className="h-100 mega-card">
              <div className="mega-card-collection h-100">
                <div className="card-image w-100">
                  <div className="img-overlay w-100 h-100 d-flex align-items-end p-3">
                    <div className="collection-name text-white text-uppercase d-flex align-items-center">
                      <div>Checkout all new arrivals</div>
                      <svg className="flex-shrink-0" width="32" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_139_1069)">
                          <path d="M-10 14H25.1717L18.5858 20.5859C17.8047 21.3668 17.8047 22.6332 18.5858 23.4143C18.9763 23.8047 19.4882 24 20 24C20.5119 24 21.0238 23.8047 21.4142 23.4141L31.4142 13.4141C32.1953 12.6332 32.1953 11.3668 31.4142 10.5857L21.4142 0.585701C20.6333 -0.195234 19.3668 -0.195234 18.5858 0.585701C17.8047 1.36664 17.8047 2.63304 18.5858 3.41411L25.1717 9.99998H-10C-11.1045 9.99998 -12 10.8954 -12 12C-12 13.1045 -11.1045 14 -10 14Z" fill="white" />
                        </g>
                        <defs>
                          <clipPath id="clip0_139_1069">
                            <rect width="44" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;

<li className="nav-item cursor-pointer dropbtn dropdown-hover border-0">
  <span className="position-relative">Women</span>
  <div className="dropdown-content mega-menu w-100 px-lg-5">
    <div className="container-fluid px-lg-48">
      <div className="row">
        <div className="col-2">
          <div className="mega-navs pe-2 h-100">
            <a href="#arrival" className="mega-nav nav-currency d-flex align-items-center gap-2 px-0 text-uppercase active">
              New Arrival
            </a>
            <a href="#arrival" className="mega-nav px-0 text-uppercase">
              popular
            </a>
            <a href="#arrival" className="mega-nav px-0 text-uppercase">
              hot this week
            </a>
            <a href="#arrival" className="mega-nav px-0 text-uppercase">
              casuals
            </a>
            <a href="#arrival" className="mega-nav px-0 text-uppercase">
              formals
            </a>
          </div>
        </div>
        <div className="col-md-7">
          <div className="row row-cols-1 row-cols-md-3 g-4 mega-row">
            <div className="col">
              <a href="#arrival" className="mega-card">
                <div>
                  <div className="card-image w-100 position-relative">
                    <img
                      src="./images/suits.webp"
                      className="w-100 h-100 object-cover"
                      alt="Product Image"
                    />
                    <div className="best-seller-tag text-uppercase position-absolute">
                      Best Seller
                    </div>
                  </div>
                  <div className="card-body text-center mt-3 letter-216">
                    <h6 className="product-title">
                      Le Dalia Ivory Liégé
                    </h6>
                    <div className="product-price">$ 380</div>
                  </div>
                </div>
              </a>
            </div>
            <div className="col">
              <a href="#arrival" className="mega-card">
                <div>
                  <div className="card-image w-100">
                    <img
                      src="./images/suits.webp"
                      className="w-100 h-100 object-cover"
                      alt="Product Image"
                    />
                  </div>
                  <div className="card-body text-center mt-3 letter-216">
                    <h6 className="product-title">
                      Le Dalia Ivory Liégé
                    </h6>
                    <div className="product-price">$ 380</div>
                  </div>
                </div>
              </a>
            </div>
            <div className="col">
              <a href="#arrival" className="mega-card">
                <div>
                  <div className="card-image w-100 position-relative">
                    <img
                      src="./images/suits.webp"
                      className="w-100 h-100 object-cover"
                      alt="Product Image"
                    />
                    <div className="best-seller-tag text-uppercase position-absolute">
                      Best Seller
                    </div>
                  </div>
                  <div className="card-body text-center mt-3 letter-216">
                    <h6 className="product-title">
                      Le Dalia Ivory Liégé
                    </h6>
                    <div className="product-price">$ 380</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="col-3">
          <a href="#arrival" className="h-100 mega-card">
            <div className="mega-card-collection h-100">
              <div className="card-image w-100">
                <div className="img-overlay w-100 h-100 d-flex align-items-end p-3">
                  <div className="collection-name text-white text-uppercase d-flex align-items-center">
                    <div>Checkout all new arrivals</div>
                    <svg className="flex-shrink-0" width="32" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_139_1069)">
                        <path d="M-10 14H25.1717L18.5858 20.5859C17.8047 21.3668 17.8047 22.6332 18.5858 23.4143C18.9763 23.8047 19.4882 24 20 24C20.5119 24 21.0238 23.8047 21.4142 23.4141L31.4142 13.4141C32.1953 12.6332 32.1953 11.3668 31.4142 10.5857L21.4142 0.585701C20.6333 -0.195234 19.3668 -0.195234 18.5858 0.585701C17.8047 1.36664 17.8047 2.63304 18.5858 3.41411L25.1717 9.99998H-10C-11.1045 9.99998 -12 10.8954 -12 12C-12 13.1045 -11.1045 14 -10 14Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_139_1069">
                          <rect width="44" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</li>