
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import the new API service function
import { getProducts } from '../services/api';

// Import components if they are in separate files
// For simplicity, we'll keep icons here, but in a real project, they'd be in a component file.
const FiSearchIcon = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FaStoreIcon = (props) => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" {...props}><path d="M567.4 329.9c-2.8-3.4-6.8-5.9-11.4-5.9H312c-4.6 0-8.6 2.5-11.4 5.9l-23.7 29.6c-4.3 5.3-11.7 6.4-17.4 2.8L209 332.6c-5.7-3.6-13.1-2.5-17.4 2.8l-23.7 29.6c-2.8 3.4-6.8 5.9-11.4 5.9H10c-5.5 0-10 4.5-10 10v96c0 17.7 14.3 32 32 32h512c17.7 0 32-14.3 32-32v-96c0-5.5-4.5-10-10-10zM144 416c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm320 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zM576 64H352V32c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v32H0v192h576V64z"></path></svg>);
const FaUsersIcon = (props) => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" {...props}><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.7 0-32 14.3-32 32v160h128V288c0-17.7-14.3-32-32-32zm-320 0H128c-17.7 0-32 14.3-32 32v160h128V288c0-17.7-14.3-32-32-32zM480 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm-192 64c-17.7 0-32 14.3-32 32v128h64V320c0-17.7-14.3-32-32-32zM320 96c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z"></path></svg>);

// --- Static Data ---
const featuresData = [
  { icon: <FiSearchIcon className="h-8 w-8 text-white" />, title: 'Real-Time Price Search', description: 'Instantly search for the latest prices of goods across different markets in Kano.' },
  { icon: <FaStoreIcon className="h-8 w-8 text-white" />, title: 'Compare Markets', description: 'Easily compare prices from various markets to find the best deals and save money.' },
  { icon: <FaUsersIcon className="h-8 w-8 text-white" />, title: 'Community Driven', description: 'Prices are updated by a community of local shop owners and shoppers like you.' },
];

const HomePage = () => {

  const HeroSection = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
      e.preventDefault();
      if (!query.trim()) return;
      navigate(`/search?q=${query}`);
    };
    return (
      <section className="relative bg-cover bg-center h-full min-h-[calc(100vh-68px)] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto"><h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">Find the Best Prices in Kano Markets</h1><p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-md">Your daily guide to fresh food prices. Compare and save on every market trip.</p><form onSubmit={handleSearch} className="max-w-xl mx-auto"><div className="relative"><FiSearchIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-4 transform -translate-y-1/2" /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-4 pl-12 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-green-300" placeholder="Search for tomatoes, rice, oil..." /><button type="submit" className="absolute inset-y-0 right-0 px-6 py-3 m-1 text-white bg-green-600 rounded-full hover:bg-green-700 font-semibold">Search</button></div></form></div>
      </section>
    );
  };

  const FeaturesSection = () => (
    <section className="py-20 bg-white"><div className="container mx-auto px-6"><div className="text-center mb-12"><h2 className="text-3xl font-bold text-gray-800">Everything You Need to Save</h2><p className="text-gray-500 mt-2">Our platform is built to make your market experience better.</p></div><div className="grid md:grid-cols-3 gap-8">{featuresData.map((feature, index) => (<div key={index} className="bg-gray-50 p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg"><div className="inline-block p-4 bg-green-600 text-white rounded-full mb-4">{feature.icon}</div><h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3><p className="text-gray-600">{feature.description}</p></div>))}</div></div></section>
  );

  const PopularItemsSection = () => {
    const [popularItems, setPopularItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchPopularItems = async () => {
        try {
          // Use the new API service function
          const { data } = await getProducts({ limit: 5 });
          const uniqueNames = [...new Set(data.map(item => item.name.split(' ')[0]))];
          setPopularItems(uniqueNames.slice(0, 5));
        } catch (error) {
          console.error("Error fetching popular items:", error);
          // Fallback to mock data on error
          setPopularItems(['Tomatoes', 'Rice', 'Onions', 'Peppers', 'Oil']);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPopularItems();
    }, []);

    const emojiMap = { Tomatoes: '🍅', Rice: '🍚', Onions: '🧅', Peppers: '🌶️', Oil: '🪔' };

    if (isLoading) {
      return <div className="text-center py-16">Loading popular items...</div>
    }

    return (
      <section className="py-16 bg-gray-50"><div className="container mx-auto px-6 text-center"><h2 className="text-3xl font-bold text-gray-800 mb-10">Popular Items</h2><div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">{popularItems.map((item, index) => (
        <Link key={index} to={`/search?q=${item.toLowerCase()}`} className="flex flex-col items-center group cursor-pointer text-decoration-none no-underline">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 mb-3 border-2 border-gray-100">
            <span className="text-4xl">{emojiMap[item] || '📦'}</span>
          </div>
          <span className="font-semibold text-gray-700">{item}</span>
        </Link>
      ))}</div></div></section>
    );
  };

  return (<><HeroSection /><PopularItemsSection /><FeaturesSection /></>);
};
export default HomePage;
