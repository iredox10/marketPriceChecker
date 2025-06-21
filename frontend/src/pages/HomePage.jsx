
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import the necessary API service functions
import { getProducts, getMarkets } from '../services/api';

// --- ICONS ---
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiRepeat = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>);
const FiTag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>);
const FiMapPin = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);

// --- Section Components ---

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };
  return (
    <section className="relative bg-cover bg-center h-full min-h-[calc(100vh-80px)] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=2070&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">Compare Market Prices in Kano, Instantly</h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-md">Save money on every market trip. Your guide to the freshest deals on food and groceries.</p>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative"><FiSearch className="w-5 h-5 text-gray-400 absolute top-1/2 left-5 transform -translate-y-1/2" /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-4 pl-12 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-green-300" placeholder="Search for tomatoes, rice, oil..." /><button type="submit" className="absolute inset-y-0 right-0 px-8 py-3 m-1 text-white bg-green-600 rounded-full hover:bg-green-700 font-semibold">Search</button></div>
        </form>
      </div>
    </section>
  );
};

const HowItWorksSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
      <p className="text-gray-500 mb-12">Saving is as easy as 1-2-3.</p>
      <div className="grid md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-4"><FiSearch className="h-10 w-10" /></div>
          <h3 className="text-xl font-bold mb-2">1. Search Product</h3>
          <p className="text-gray-600">Enter any item you want to buy, from fresh produce to grains.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-4"><FiRepeat className="h-10 w-10" /></div>
          <h3 className="text-xl font-bold mb-2">2. Compare Prices</h3>
          <p className="text-gray-600">See a list of prices from different shops across various markets.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-4"><FiTag className="h-10 w-10" /></div>
          <h3 className="text-xl font-bold mb-2">3. Save Money</h3>
          <p className="text-gray-600">Choose the best deal and shop with confidence, knowing you got the best price.</p>
        </div>
      </div>
    </div>
  </section>
);

const PopularItemsSection = ({ popularItems }) => {
  const emojiMap = { Tomatoes: '🍅', Rice: '🍚', Onions: '🧅', Peppers: '🌶️', Oil: '🪔', Grains: '🌾', Beans: '🫘' };
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Items</h2>
        <p className="text-gray-500 mb-12">See what others are searching for right now.</p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {popularItems.map((item, index) => (
            <Link key={index} to={`/search?q=${item.toLowerCase()}`} className="flex flex-col items-center group cursor-pointer text-decoration-none no-underline">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 mb-3 border-2 border-gray-100">
                <span className="text-4xl">{emojiMap[item] || '📦'}</span>
              </div>
              <span className="font-semibold text-gray-700 capitalize">{item}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedMarketsSection = ({ markets }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Markets</h2>
      <p className="text-gray-500 mb-12">Explore popular markets in Kano.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {markets.map(market => (
          <Link key={market._id} to={`/markets/${market.id || market._id}`} className="block bg-white p-6 rounded-lg shadow hover:shadow-xl transition-shadow text-left">
            <h3 className="font-bold text-green-600 flex items-center"><FiMapPin className="h-4 w-4 mr-2" />{market.name}</h3>
            <p className="text-sm text-gray-600 mt-2 truncate">{market.description || 'A major hub for various goods.'}</p>
          </Link>
        ))}
      </div>
      <Link to="/markets" className="inline-block mt-12 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Explore All Markets</Link>
    </div>
  </section>
);


const HomePage = () => {
  const [featuredMarkets, setFeaturedMarkets] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Fetch markets and products concurrently
        const [marketsRes, productsRes] = await Promise.all([
          getMarkets(),
          getProducts({ limit: 5 }) // You might create a specific popular endpoint later
        ]);

        setFeaturedMarkets(marketsRes.data.slice(0, 4));

        // Process products to get unique items for display
        const uniqueNames = [...new Set(productsRes.data.map(item => item.name.split(' ')[0]))];
        setPopularItems(uniqueNames.slice(0, 5));

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      {!isLoading && popularItems.length > 0 && (
        <PopularItemsSection popularItems={popularItems} />
      )}
      {!isLoading && featuredMarkets.length > 0 && (
        <FeaturedMarketsSection markets={featuredMarkets} />
      )}
    </>
  );
};

export default HomePage;
