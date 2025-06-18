import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import the new AuthProvider
import { AuthProvider } from './context/AuthContext';

// Import layout components
import Header from './components/Header';
import Footer from './components/Footer';

// Import page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/user/Registration.jsx';
import UserProfilePage from './pages/user/Profile.jsx';
import SearchResultsPage from './pages/SearchResultPage.jsx';
import MarketListPage from './pages/market/MarketList.jsx';
import MarketDetailPage from './pages/market/MarketDetail.jsx';
import AdminDashboardPage from './pages/admin/Dashboard.jsx';
import ManageShopOwnersPage from './pages/admin/ManageShopOwner.jsx';
import ViewAllProductsPage from './pages/admin/Products.jsx';
import ShopOwnerDashboardPage from './pages/shopowner/Dashboard.jsx';
import NotFoundPage from './pages/NotFoundPage';
import AdminPriceReportsPage from './pages/admin/AdminPriceReportPage.jsx';

/**
 * The main App component.
 */
const App = () => {
  return (
    // Wrap the entire app in BrowserRouter and then AuthProvider
    <BrowserRouter>
      <AuthProvider>
        <div className="font-sans bg-gray-50 text-gray-800 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-[80px]"> {/* Adjusted padding for header height */}
            <Routes>
              {/* ... All your existing routes ... */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/market-list" element={<MarketListPage />} />
              <Route path="/markets/:marketId" element={<MarketDetailPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/manage-shop-owners" element={<ManageShopOwnersPage />} />
              <Route path="/admin/view-all-products" element={<ViewAllProductsPage />} />
              <Route path="/admin/price-reports" element={<AdminPriceReportsPage />} />
              <Route path="/shop-owner/dashboard" element={<ShopOwnerDashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
