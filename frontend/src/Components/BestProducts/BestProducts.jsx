import React, { useEffect, useRef, useState } from 'react';
import Slider from "react-slick";
import './BestProducts.css';
import ItemNew from '../ItemNew/ItemNew';
import { fetchTopCategories, getProductsByTopCategory } from '../../services/api';

const BestProducts = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('women'); // Default active tab is 'women'
  const [categories, setCategories] = useState({ women: null, men: null });
  const sliderRef = useRef(null); // Add this line at the beginning

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await fetchTopCategories();
        const womenCategory = categoryData.find(category => category.name.toLowerCase() === 'women');
        const menCategory = categoryData.find(category => category.name.toLowerCase() === 'men');
        setCategories({ women: womenCategory?._id, men: menCategory?._id });

        if (womenCategory) {
          const products = await getProductsByTopCategory(womenCategory._id);
          const popularItems = products.filter(product => product.isPopular);
          setPopularProducts(popularItems);
        }
      } catch (error) {
        console.error('Error fetching categories or products:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (categories[activeTab]) {
        try {
          const products = await getProductsByTopCategory(categories[activeTab]);
          const popularItems = products.filter(product => product.isPopular);
          setPopularProducts(popularItems);
        } catch (error) {
          console.error('Error fetching popular products:', error);
        }
      }
    };

    fetchProducts();
  }, [activeTab, categories]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0); // Go to the first slide on popularProducts update
    }
  }, [popularProducts]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
          dots: true,
          speed: 200
        },
      },
    ]
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="best-section section-padding text-center theme-bg">
      <div className="section-header">
        <h6 className="section-subhead">Our best sellers</h6>
      </div>
      <div className="section-body">
        <div className="container">
          <div className="best-tabs d-flex align-items-center justify-content-center letter-5">
            <h3
              className={`best-tab fw-normal cursor-pointer text-uppercase ${activeTab === 'women' ? 'active' : ''}`}
              onClick={() => handleTabClick('women')}
            >
              Women
            </h3>
            <h3
              className={`best-tab fw-normal cursor-pointer text-uppercase ${activeTab === 'men' ? 'active' : ''}`}
              onClick={() => handleTabClick('men')}
            >
              Men
            </h3>
          </div>
          <div className="slider-container responsive" id='best-sliderContainer'>
            <Slider {...settings} ref={sliderRef}>
              {popularProducts.map((item) => (
                <ItemNew
                  key={item._id}
                  id={item._id}
                  image={item.featuredImage}
                  itemName={item.itemName}
                  newPrice={item.newPrice}
                  oldPrice={item.oldPrice}
                  tag={item.tag}
                />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestProducts;