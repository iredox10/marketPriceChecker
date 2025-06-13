
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// --- ICONS ---
const FiMapPin = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const FiTag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>);
const FiUsers = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);


// --- Mock Data (Simulating API calls) ---
const mockMarketsData = {
  'kasuwar-rimi': {
    name: 'Kasuwar Rimi',
    location: 'Rimi, Kano',
    shopOwners: ['Bello Sani (Sani\'s Grains)', 'Musa Ibrahim (Ibrahim & Sons)'],
    popularProducts: ['Tomatoes', 'Rice', 'Onions', 'Maize', 'Millet']
  },
  'sabon-gari': {
    name: 'Sabon Gari Market',
    location: 'Sabon Gari, Kano',
    shopOwners: ['Aisha Lawan (Aisha General Store)'],
    popularProducts: ['Rice', 'Palm Oil', 'Spices', 'Textiles', 'Electronics']
  },
  'yankura': {
    name: 'Yankura Market',
    location: 'Yankura, Kano',
    shopOwners: ['Fatima Bala (Fati\'s Fresh Produce)'],
    popularProducts: ['Tomatoes', 'Peppers', 'Fruits', 'Vegetables']
  },
  'kantin-kwari': {
    name: 'Kantin Kwari',
    location: 'Kwari, Kano',
    shopOwners: ['Musa Ibrahim (Ibrahim & Sons)'],
    popularProducts: ['Textiles', 'Grains', 'Rice', 'Clothing']
  },
};

/**
 * MarketDetailPage Component
 * Displays details for a specific market.
 */
const MarketDetailPage = () => {
  // Get the marketId from the URL (e.g., "kasuwar-rimi")
  const { marketId } = useParams();
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching market data based on the ID from the URL
    console.log(`Fetching data for market: ${marketId}`);
    setTimeout(() => {
      const data = mockMarketsData[marketId];
      setMarket(data);
      setIsLoading(false);
    }, 500);
  }, [marketId]);

  if (isLoading) {
    return <div className="text-center py-20">Loading market details...</div>;
  }

  if (!market) {
    return <div className="text-center py-20">Market not found.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">{market.name}</h1>
          <p className="mt-1 text-lg text-gray-600 flex items-center">
            <FiMapPin className="h-5 w-5 mr-2 text-gray-400" />
            {market.location}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column for Popular Products */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiTag className="h-5 w-5 mr-3 text-green-600" />
                Popular Products in this Market
              </h2>
              <div className="flex flex-wrap gap-2">
                {market.popularProducts.map(product => (
                  <Link
                    key={product}
                    to={`/search?q=${product.toLowerCase()}`}
                    className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors"
                  >
                    {product}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column for Shop Owners */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiUsers className="h-5 w-5 mr-3 text-green-600" />
                Registered Shops
              </h2>
              <ul className="space-y-3">
                {market.shopOwners.map(owner => (
                  <li key={owner} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                    {owner}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailPage;
