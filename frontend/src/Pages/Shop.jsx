import React from 'react'
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
      <AboutSection />
      <VideoSection />
      <BlogSection />
    </div>
  )
}

export default Shop