
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import the useAuth hook
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo'

// --- ICONS ---
const FiMenu = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiUser = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const FiLogOut = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const FiLayout = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>);


const Header = () => {
  // Get auth state and functions from the context
  const { userInfo, logout } = useAuth();
  console.log(userInfo)

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const location = useLocation();
  const profileMenuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // Call the logout function from context
    setIsProfileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!userInfo) return '/';
    switch (userInfo.role) {
      case 'Admin': return '/admin/dashboard';
      case 'ShopOwner': return '/shop-owner/dashboard';
      default: return '/profile';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <Logo className="h-16 w-auto" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
            <Link to="/market-list" className="text-gray-600 hover:text-green-600">Markets</Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600">About</Link>
          </nav>
          <div className="hidden md:block">
            {userInfo ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">{userInfo.name.charAt(0).toUpperCase()}</div>
                  <span className="text-sm font-medium text-gray-700 pr-2">{userInfo.name}</span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    {userInfo.role !== 'admin' ? <Link to={getDashboardLink()} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FiLayout className="mr-3 h-5 w-5" /> Dashboard</Link> :
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FiUser className="mr-3 h-5 w-5" /> My Profile</Link>}
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><FiLogOut className="mr-3 h-5 w-5" /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Login</Link>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md"><FiMenu className="w-6 h-6" /></button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t p-4 space-y-2">
          {/* Mobile menu links */}
        </nav>
      )}
    </header>
  );
};

export default Header;
