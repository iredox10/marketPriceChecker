
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// The import path uses '..' to go up one directory level from 'pages' to 'src'
// and then into 'components'.
import { FiSearchIcon, FaStoreIcon, FaUsersIcon } from '../components/Header';

// --- HELPER DATA (can be moved to a separate file later) ---
const featuredItemsData = [{ name: 'Tomatoes', emoji: '🍅' }, { name: 'Onions', emoji: '🧅' }, { name: 'Rice', emoji: '🍚' }, { name: 'Peppers', emoji: '🌶️' }, { name: 'Palm Oil', emoji: '🪔' }];
const featuresData = [
  { icon: <FiSearchIcon className="h-8 w-8 text-white" />, title: 'Real-Time Price Search', description: 'Instantly search for the latest prices of goods across different markets in Kano.' },
  { icon: <FaStoreIcon className="h-8 w-8 text-white" />, title: 'Compare Markets', description: 'Easily compare prices from various markets to find the best deals and save money.' },
  { icon: <FaUsersIcon className="h-8 w-8 text-white" />, title: 'Community Driven', description: 'Prices are updated by a community of local shop owners and shoppers like you.' },
];


// This would be src/pages/HomePage.jsx
const HomePage = () => {
  // These sections are defined inside HomePage for simplicity.
  // They could also be broken into their own components in a 'components' folder.
  const HeroSection = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSearch = (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      setIsLoading(true);
      setTimeout(() => {
        alert(`Search functionality for "${query}" would connect to your API here.`);
        setIsLoading(false);
      }, 1000);
    };
    return (
      <section className="relative bg-cover bg-center h-full min-h-[calc(100vh-68px)] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto"><h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">Find the Best Prices in Kano Markets</h1><p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-md">Your daily guide to fresh food prices. Compare and save on every market trip.</p><form onSubmit={handleSearch} className="max-w-xl mx-auto"><div className="relative"><FiSearchIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-4 transform -translate-y-1/2" /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-4 pl-12 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-green-300" placeholder="Search for tomatoes, rice, oil..." /><button type="submit" disabled={isLoading} className="absolute inset-y-0 right-0 px-6 py-3 m-1 text-white bg-green-600 rounded-full hover:bg-green-700 font-semibold disabled:bg-green-400">{isLoading ? '...' : 'Search'}</button></div></form></div>
      </section>
    );
  };

  const FeaturesSection = () => (
    <section className="py-20 bg-white"><div className="container mx-auto px-6"><div className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-800">Everything You Need to Save</h2><p className="text-gray-500 mt-2">Our platform is built to make your market experience better.</p></div><div className="grid md:grid-cols-3 gap-8">{featuresData.map((feature, index) => (<div key={index} className="bg-gray-50 p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg"><div className="inline-block p-4 bg-green-600 text-white rounded-full mb-4">{feature.icon}</div><h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3><p className="text-gray-600">{feature.description}</p></div>))}</div></div></section>
  );

  const PopularItemsSection = () => (
    <section className="py-16 bg-gray-50"><div className="container mx-auto px-6 text-center"><h2 className="text-3xl font-bold text-gray-800 mb-10">Popular Items</h2><div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">{featuredItemsData.map((item, index) => (<div key={index} className="flex flex-col items-center group cursor-pointer"><div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 mb-3 border-2 border-gray-100"><span className="text-4xl">{item.emoji}</span></div><span className="font-semibold text-gray-700">{item.name}</span></div>))}</div></div></section>
  );

  return (<><HeroSection /><PopularItemsSection /><FeaturesSection /></>);
};
export default HomePage;


// This would be src/pages/AboutPage.jsx
export const AboutPage = () => (
  <div className="bg-white"><div className="container mx-auto px-6 py-12"><div className="max-w-3xl mx-auto"><h1 className="text-4xl font-bold text-gray-800 mb-4">About Kano Price Checker</h1><p className="text-lg text-gray-600 mb-6">Kano Price Checker was born from a simple idea: to bring transparency and convenience to grocery shopping in the bustling markets of Kano, Nigeria. We believe that everyone deserves access to fair and up-to-date pricing information to make informed decisions for their families and businesses.</p><p className="text-lg text-gray-600 mb-6">Our platform connects you directly with a network of trusted shop owners who provide real-time price updates on a wide variety of goods. Whether you're planning a weekly shopping trip, catering for an event, or just curious about the current market rates, our app is your reliable guide.</p><h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3">Our Mission</h2><p className="text-lg text-gray-600">Our mission is to empower consumers and support local vendors by creating a central, easy-to-use hub for market price information. We aim to foster a community built on trust and help everyone save time and money.</p></div></div></div>
);


// This would be src/pages/NotFoundPage.jsx
export const NotFoundPage = () => (
  <div className="text-center py-24"><h1 className="text-6xl font-bold text-green-600">404</h1><p className="text-xl text-gray-700 mt-4">Page Not Found</p><Link to="/" className="inline-block mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Go Back Home</Link></div>
);
