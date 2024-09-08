import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Announcement from './Components/Announcement/Announcement';
import NavbarNew from './Components/NavbarNew/NavbarNew';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FooterNew from './Components/FooterNew/FooterNew';
import ProductsByTopCategory from './Pages/ProductsByTopCategory'; // New component
import ProductsByParentCategory from './Pages/ProductsByParentCategory'; // New component
import ProductsByChildCategory from './Pages/ProductsByChildCategory'; // New component
import ShopContextProvider, { ShopContext } from './Context/ShopContext';
import CartDrawer from './Components/NavbarNew/CartDrawer/CartDrawer';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ShopContextProvider>
          <AppContent />
        </ShopContextProvider>
      </BrowserRouter>

    </div>
  );
}

function AppContent() {
  const { isCartOpen, closeCartDrawer } = useContext(ShopContext);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Announcement />
      <NavbarNew isSticky={isSticky} />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/:categoryId' element={<ShopCategory />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginSignup />} />
        <Route path='/category/:categoryId' element={<ProductsByTopCategory />} />
        <Route path='/parentcat/:parentId' element={<ProductsByParentCategory />} />
        <Route path='/childcat/:childId' element={<ProductsByChildCategory />} />
      </Routes>
      <FooterNew />
      <CartDrawer isCartOpen={isCartOpen} onClose={closeCartDrawer} isSticky={isSticky} />
    </>
  );
}

export default App;