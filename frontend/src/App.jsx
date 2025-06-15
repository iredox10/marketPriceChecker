
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import layout components from the 'components' directory
import Header from './components/Header';
import Footer from './components/Footer';

// Import page components from the 'pages' directory
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboardPage from './pages/admin/Dashboard.jsx';
import ManageShopOwnersPage from './pages/admin/ManageShopOwner.jsx';
import ViewAllProductsPage from './pages/admin/Products.jsx';
import ShopOwnerDashboardPage from './pages/shopowner/Dashboard.jsx';
import SearchResultsPage from './pages/SearchResultPage.jsx';
import MarketListPage from './pages/market/MarketList.jsx';
import MarketDetailPage from './pages/market/MarketDetail.jsx';
import UserProfilePage from './pages/user/Profile.jsx';
import RegistrationPage from './pages/user/Registration.jsx';

/**
 * The main App component.
 * It sets up the BrowserRouter, defines the overall layout with a
 * Header and Footer, and handles all the page routing.
 */
const App = () => {
  return (
    <BrowserRouter>
      <div className="font-sans bg-gray-50 text-gray-800 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-[68px]"> {/* Padding top to offset the fixed header */}
          <Routes>
            {/* Route for the Home Page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />

            <Route path="/search" element={<SearchResultsPage />} />



            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/manage-shop-owners" element={<ManageShopOwnersPage />} />
            <Route path="/admin/view-all-products" element={<ViewAllProductsPage />} />


            <Route path="/shop-owner/dashboard" element={<ShopOwnerDashboardPage />} />


            <Route path="/profile" element={<UserProfilePage />} />


            <Route path="/search?q" element={<ShopOwnerDashboardPage />} />

            {/* Route for the About Page */}
            <Route path="/about" element={<AboutPage />} />

            <Route path="/market-list" element={<MarketListPage />} />
            <Route path="/markets/:marketId" element={<MarketDetailPage />} />

            {/* Catch-all route for pages that don't exist */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
