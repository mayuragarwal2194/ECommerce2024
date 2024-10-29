import React, { useState, useEffect } from 'react';
import './Hamburger.css';
import { fetchTopCategories } from '../../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopCategory, setActiveTopCategory] = useState(null);
  const [activeParentCategory, setActiveParentCategory] = useState(null);
  const [topCategories, setTopCategories] = useState([]);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      document.body.classList.add('no-scroll'); // Disable body scroll
    } else {
      document.body.classList.remove('no-scroll'); // Enable body scroll
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.classList.remove('no-scroll'); // Re-enable body scroll
  };


  const handleTopCategoryClick = (topId) => {
    setActiveTopCategory(activeTopCategory === topId ? null : topId);
    setActiveParentCategory(null); // Close all parent categories when changing top category
  };

  const handleParentCategoryClick = (parentId, e) => {
    e.stopPropagation(); // Prevents event bubbling
    setActiveParentCategory(activeParentCategory === parentId ? null : parentId);
  };

  return (
    <>
      <div className="hamburger d-lg-none flex-1">
        <div className="hamburger-icon" onClick={toggleMenu}>
          <svg
            aria-hidden="true"
            focusable="false"
            role="presentation"
            className="icon icon-hamburger hamburger-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
          >
            <title>icon-hamburger</title>
            <path
              d="M7 15h51M7 32h43M7 49h51"
              stroke="currentColor"
              fill="none"
              strokeWidth="3"
            />
          </svg>
        </div>
        <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
          <div className="border-bottom mb-3">
            <div className="container">
              <div className="hamburger-header d-flex align-items-center justify-content-center py-12">
                <div className="ham-store-logo-wrapper">
                  <Link to="/" aria-label="Visit Homepage" className="ham-store-logo d-block text-decoration-none" onClick={closeMenu}>
                    <img src="./images/logoBlack.png" className="w-100 h-100" alt="Store Logo" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="hamburger-navs px-12">
            {topCategories.map(({ _id: topId, name: topName, children: parentCategories }) => (
              <div key={topId} className="select-menu py-2">
                <div className="select" onClick={() => handleTopCategoryClick(topId)}>
                  <span className={`topcat text-capitalize ${activeTopCategory === topId && 'active'}`}>{topName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`${activeTopCategory === topId ? 'rotate' : ''}`} width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m6 9l6 6l6-6" />
                  </svg>
                </div>
                <div className={`options-list ${activeTopCategory === topId ? 'active' : ''}`}>
                  {parentCategories.map(({ _id: parentId, name: parentName, children: childCategories }) => (
                    <div key={parentId} className="hamvurger-nav-item">
                      <div className="select py-2" onClick={(e) => handleParentCategoryClick(parentId, e)}>
                        <span className='text-capitalize'>{parentName}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${activeParentCategory === parentId ? 'rotate' : ''}`} width="1em" height="1em" viewBox="0 0 24 24">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m6 9l6 6l6-6" />
                        </svg>
                      </div>
                      <div className={`child-options-list ${activeParentCategory === parentId ? 'active' : ''}`}>
                        {childCategories.map(({ _id: childId, name: childName }) => (
                          <Link key={childId} to={`/childcat/${childId}`} className="child-option text-decoration-none d-block" onClick={closeMenu}>
                            {childName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <ul className='list-unstyled border-top mt-5'>
              <li className='ps-0 py-2'>Shop</li>
              <li className='ps-0 py-2'>About</li>
              <li className='ps-0 py-2'>Blog</li>
              <li className='ps-0 py-2'>
                <Link to={'/contact'} className='text-decoration-none' onClick={closeMenu}>
                  <span className="position-relative">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hamburger-overlay" onClick={closeMenu}></div>
      </div>
    </>
  );
};

export default Hamburger;
