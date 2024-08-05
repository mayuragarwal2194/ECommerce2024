import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import AdminPanel from './Components/AdminPanel';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route
          index
          element={<AdminPanel activeTab="addProduct" />} />
        <Route
          path="/viewproduct"
          element={<AdminPanel activeTab="viewProducts" />}
        />
        <Route
          path="/addtopcategory"
          element={<AdminPanel activeTab="addTopCategory" />}
        />
        <Route
          path="/viewtopcategory"
          element={<AdminPanel activeTab="viewTopCategory" />}
        />
        <Route
          path="/parentcategories/add"
          element={<AdminPanel activeTab="addParentCategory" />}
        />
        <Route
          path="/parentcategories/view"
          element={<AdminPanel activeTab="viewParentCategories" />}
        />
        <Route
          path="/childcategories/add"
          element={<AdminPanel activeTab="addChildCategory" />}
        />
        <Route
          path="/childcategories/view"
          element={<AdminPanel activeTab="viewChildCategories" />}
        />
      </Route>
    </Routes>
  );
}

export default App;