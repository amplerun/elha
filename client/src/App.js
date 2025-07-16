import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/Admin/AdminDashboard';
import UserListPage from './pages/Admin/UserListPage';
import OrderListPage from './pages/Admin/OrderListPage';
import StoreListPage from './pages/Admin/StoreListPage';

import SellerDashboard from './pages/Seller/SellerDashboard';
import ProductListPage from './pages/Seller/ProductListPage';
import ProductCreatePage from './pages/Seller/ProductCreatePage';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="" element={<ProtectedRoute />}>
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="" element={<ProtectedRoute sellerOnly={true} />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<ProductListPage />} />
            <Route path="/seller/product/create" element={<ProductCreatePage />} />
            <Route path="/seller/product/:id/edit" element={<ProductCreatePage />} />
          </Route>

          <Route path="" element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserListPage />} />
            <Route path="/admin/orders" element={<OrderListPage />} />
            <Route path="/admin/stores" element={<StoreListPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}
export default App;