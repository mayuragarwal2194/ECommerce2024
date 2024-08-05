import React from 'react'
// import Hero from '../Components/Hero/Hero'
// import Popular from '../Components/Popular/Popular'
// import Offers from '../Components/Offers/Offers'
// import NewCollections from '../Components/NewCollections/NewCollections'
// import NewsLetter from '../Components/NewsLetter/NewsLetter'
import HeroNew from '../Components/HeroNew/HeroNew'
import ValueSection from '../Components/ValueSection/ValueSection'
import BestProducts from '../Components/BestProducts/BestProducts'
import CategorySection from '../Components/CategorySection/CategorySection'
import PopularNew from '../Components/PopularNew/PopularNew'
import NewArrivalSection from '../Components/NewArrivalSection/NewArrivalSection'
import OurSelectionSection from '../Components/OurSelectionSection/OurSelectionSection'
import Brand from '../Components/Brand/Brand'
import VideoSection from '../Components/VideoSection/VideoSection'
import AboutSection from '../Components/AboutSection/AboutSection'
import BlogSection from '../Components/BlogSection/BlogSection'

const Shop = () => {
  return (
    <div>
      <HeroNew />
      <ValueSection />
      <BestProducts />
      <CategorySection />
      <PopularNew />
      <NewArrivalSection />
      <OurSelectionSection />
      <Brand />
      <VideoSection />
      <AboutSection />
      <BlogSection />
      {/* <Hero /> */}
      {/* <Popular /> */}
      {/* <Offers /> */}
      {/* <NewCollections /> */}
      {/* <NewsLetter /> */}
    </div>
  )
}

export default Shop