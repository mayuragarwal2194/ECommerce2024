import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './Components/Footer/Footer';
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
      {shouldRenderComponent && <NavbarNew />}
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/:categoryId' element={<ShopCategory />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginSignup />} />
        {/* Route for Admin panel */}
        {/* <Route path='/admin/*' element={<AdminPanel />} /> */}
        {/* Route for editing categories */}
        {/* <Route path="/admin/categories/edit/:categoryId" element={<AdminPanel />} /> */}
      </Routes>
      {shouldRenderComponent && <FooterNew />}
    </>
  );
}

export default App;