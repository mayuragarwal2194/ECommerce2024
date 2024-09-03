import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Announcement from './Components/Announcement/Announcement';
import Navbar from './Components/Navbar/Navbar';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FooterNew from './Components/FooterNew/FooterNew';
import ProductsByTopCategory from './Pages/ProductsByTopCategory'; // New component
import ProductsByParentCategory from './Pages/ProductsByParentCategory'; // New component
import ProductsByChildCategory from './Pages/ProductsByChildCategory'; // New component

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const shouldRenderComponent = !location.pathname.startsWith('/admin');

  return (
    <>
      {shouldRenderComponent && <Announcement />}
      {shouldRenderComponent && <Navbar />}
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
      {shouldRenderComponent && <FooterNew />}
    </>
  );
}

export default App;