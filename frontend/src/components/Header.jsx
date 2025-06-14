
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// In a real project, this would be src/components/Icons.jsx
// It centralizes all icons for easy management.
export const FiMenuIcon = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
export const FiXIcon = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
export const FiSearchIcon = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
export const FaStoreIcon = (props) => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" {...props}><path d="M567.4 329.9c-2.8-3.4-6.8-5.9-11.4-5.9H312c-4.6 0-8.6 2.5-11.4 5.9l-23.7 29.6c-4.3 5.3-11.7 6.4-17.4 2.8L209 332.6c-5.7-3.6-13.1-2.5-17.4 2.8l-23.7 29.6c-2.8 3.4-6.8 5.9-11.4 5.9H10c-5.5 0-10 4.5-10 10v96c0 17.7 14.3 32 32 32h512c17.7 0 32-14.3 32-32v-96c0-5.5-4.5-10-10-10zM144 416c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm320 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zM576 64H352V32c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v32H0v192h576V64z"></path></svg>);
export const FaUsersIcon = (props) => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" {...props}><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.7 0-32 14.3-32 32v160h128V288c0-17.7-14.3-32-32-32zm-320 0H128c-17.7 0-32 14.3-32 32v160h128V288c0-17.7-14.3-32-32-32zM480 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm-192 64c-17.7 0-32 14.3-32 32v128h64V320c0-17.7-14.3-32-32-32zM320 96c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z"></path></svg>);


// This would be src/components/Header.jsx
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Effect to close the mobile menu automatically when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800">KanoPrice<span className="text-green-600">Checker</span></Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
            <Link to="/market-list" className="text-gray-600 hover:text-green-600 transition-colors">Markets</Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors">About</Link>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none" aria-label="Open menu">
              {isMenuOpen ? <FiXIcon className="w-6 h-6" /> : <FiMenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden mt-4">
            <Link to="/" className="block py-2 text-gray-600 hover:text-green-600">Home</Link>
            <Link to="/about" className="block py-2 text-gray-600 hover:text-green-600">About</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; // This line is conventionally at the end of the file

// This would be src/components/Footer.jsx
export const Footer = () => {
  const [time, setTime] = useState(new Date());

  // Effect to update the time every second
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  // Format time for the Nigerian timezone
  const nigerianTime = time.toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' });

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Kano Price Checker. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          Made with <span className="text-red-500">&hearts;</span> in Kano. Current time in Nigeria: {nigerianTime}
        </p>
      </div>
    </footer>
  );
};
