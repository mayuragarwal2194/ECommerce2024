import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
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
import Contact from './Pages/Contact/Contact';
import Profile from './Components/Profile/Profile';
import Login from './Components/Login/Login';
import { isAuthenticated, PrivateRoute } from './Components/Utils/utils';
import Signup from './Components/Signup/Signup';
import PasswordReset from './Components/Profile/PasswordReset/PasswordReset';
import { ToastContainer } from 'react-toastify';


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
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/:categoryId' element={<ShopCategory />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile' element={<PrivateRoute element={<Profile />} />} />
        <Route path='/category/:categoryId' element={<ProductsByTopCategory />} />
        <Route path='/parentcat/:parentId' element={<ProductsByParentCategory />} />
        <Route path='/childcat/:childId' element={<ProductsByChildCategory />} />
        <Route path="/password-reset/:token" element={<PasswordReset />} />
      </Routes>
      <FooterNew />
      <CartDrawer isCartOpen={isCartOpen} onClose={closeCartDrawer} isSticky={isSticky} />
    </>
  );
}

export default App;