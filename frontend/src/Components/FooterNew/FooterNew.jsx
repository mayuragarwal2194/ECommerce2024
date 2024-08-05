 /* eslint-disable */
import React from 'react';
import './FooterNew.css';

const FooterNew = () => {
  return (
    <>
      <footer className="footer-section text-start text-lg-start text-creame bg-black">
        <div className="w-100 footer-bg py-5">
          <div className="container">
            <div className="row align-items-start footer-main-row">
              <div className="col-12 col-lg-3">
                <h5 className="footer-head text-uppercase fw-normal footer-collection-head letter-216 mt-4 mt-lg-0">
                  Newsletter
                </h5>
                <p className="footer-detail mt-3">
                  Subscribe to receive updates, access to exclusive deals, and more.
                </p>
                <div className="footer-email">
                  <input
                    type="email"
                    name='email'
                    id='email'
                    autoComplete='true'
                    placeholder="E-mail"
                    className="bg-transparent w-100 mt-3 text-creame"
                  />
                  <button
                    role="button"
                    className="ff-btn ff-btn-fill-light text-uppercase text-decoration-none d-block w-fit-content mt-3"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="col-12 col-lg-9">
                <div className="row">
                  <div className="col-12 col-lg-4">
                    <div className="footer-wrapper w-100 w-fit-content">
                      <h5 className="footer-head text-uppercase fw-normal footer-collection-head letter-216">
                        Shop
                      </h5>
                      <div className="footer-collection mt-3">
                        <ul className="text-capitalize list-unstyled mb-0">
                          <li>
                            <a href="#" className="text-decoration-none"> Women </a>
                          </li>
                          <li>
                            <a href="#" className="text-decoration-none"> Men </a>
                          </li>
                          <li>
                            <a href="#" className="text-decoration-none"> Small Leather Goods </a>
                          </li>
                          <li>
                            <a href="#" className="text-decoration-none"> Collaboration </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="footer-wrapper w-100 w-fit-content mt-4 mt-lg-0">
                      <h5 className="footer-head text-uppercase fw-normal letter-216">
                        Information
                      </h5>
                      <div className="footer-quick-links mt-3">
                        <ul className="ps-0 mb-0">
                          <li className="list-unstyled underline-hover-effect">
                            <a href="#" className="text-decoration-none mb-0 pb-0">
                              Theme Features
                            </a>
                          </li>
                          <li className="list-unstyled underline-hover-effect">
                            <a href="#" className="text-decoration-none mb-0 pb-0">
                              About Us
                            </a>
                          </li>
                          <li className="list-unstyled underline-hover-effect">
                            <a href="#" className="text-decoration-none mb-0 pb-0">
                              Contact Us
                            </a>
                          </li>
                          <li className="list-unstyled underline-hover-effect">
                            <a href="#" className="text-decoration-none mb-0 pb-0">
                              FAQ
                            </a>
                          </li>
                          <li className="list-unstyled underline-hover-effect">
                            <a href="#" className="text-decoration-none mb-0 pb-0">
                              Maintenance Tips
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4">
                    <div className="mt-4 mt-lg-0">
                      <h5 className="footer-head text-uppercase fw-normal mb-3 letter-216">
                        About the shop
                      </h5>
                      <p className="line-height-24 text-creame">
                        The story of Leo and Violette, it's ours. We are Léo Dominguez & Violette Polchi. Two Parisian lovers sharing our lives for more than 8 years. Since the early days of our meeting, we always had the dream to develop a project together. Here it is!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul className="footer-navs d-flex align-items-center justify-content-center justify-content-md-start gap-3 flex-wrap list-unstyled mt-4 mt-lg-5">
              <li className="share-link mb-0">
                <a href="#" className="d-block mb-0">
                  <i className="ri-facebook-fill"></i>
                </a>
              </li>
              <li className="share-link mb-0">
                <a href="#" className="d-block mb-0">
                  <i className="ri-twitter-x-fill"></i>
                </a>
              </li>
              <li className="share-link mb-0">
                <a href="#" className="d-block mb-0">
                  <i className="ri-instagram-line"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-below text-center text-lg-start mt-4 copyright-footer">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">
              <div className="flex-1">
                <div className="footer-dropdown-wrapper">
                  <div className="dropdown dropdown-hover desktop-dropdown position-relative w-fit-content py-1">
                    <button className="dropbtn border-0 bg-transparent d-flex align-items-center gap-2 text-creame cursor-pointer">
                      <img src="./icons/us.svg" alt="" />
                      <span className="text-creame">United States (USD $)</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 1L5 5L1 1" stroke="#ffffff" strokeLinecap="square" />
                      </svg>
                    </button>
                    <div className="dropdown-content">
                      <div className="ps-3 py-3 d-flex flex-column gap-2">
                        <a href="#" className="nav-currency d-flex align-items-center gap-2">
                          <img src="./icons/us.svg" alt="" />
                          <span>United States (USD $)</span>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1L5 5L1 1" stroke="#ffffff" strokeLinecap="square" />
                          </svg>
                        </a>
                        <a href="#">Service 2</a>
                        <a href="#">Service 3</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg-start text-center">
                <p className="mb-0 text-creame">
                  &copy; 2023 Leo & Violette. All Rights Reserved
                </p>
              </div>
              <div className="mt-3 mt-lg-0 flex-1">
                <ul className="footer-bottom-navs list-unstyled d-flex justify-content-center justify-content-lg-end mb-0">
                  <li>
                    <a href="#" className="text-creame text-decoration-none ps-0 ps-lg-3">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-creame text-decoration-none ps-0 ps-lg-3">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterNew;