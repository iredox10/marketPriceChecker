
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import the API service function
import { getMarkets } from '../../services/api';

// --- ICONS ---
const FiChevronRight = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);

/**
 * MarketListPage Component
 * Displays a searchable and filterable list of all available markets fetched from the backend.
 */
const MarketListPage = () => {
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const { data } = await getMarkets();
        // In a real app, the shopOwnerCount would come from the backend.
        // We'll add a placeholder count for now.
        const marketsWithCount = data.map(market => ({
          ...market,
          shopOwnerCount: Math.floor(Math.random() * 50) + 10 // Placeholder
        }));
        setMarkets(marketsWithCount);
      } catch (err) {
        console.error("Error fetching markets:", err);
        setError("Could not load markets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  const filteredMarkets = markets.filter(market =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Explore Kano's Markets</h1>
          <p className="mt-2 text-lg text-gray-600">Find information about markets near you.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for a market by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Markets Grid */}
        {isLoading ? (
          <div className="text-center py-16">Loading markets...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : filteredMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMarkets.map(market => (
              <div key={market._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{market.name}</h2>
                  <p className="text-sm font-semibold text-green-600 mb-2">{market.location}</p>
                  <p className="text-sm text-gray-600 mb-4">{market.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-500">{market.shopOwnerCount} registered shops</p>
                  <Link
                    to={`/markets/${market._id}`}
                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
                  >
                    View Market <FiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700">No Markets Found</h3>
            <p className="text-gray-500 mt-2">Your search for "{searchTerm}" did not match any markets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketListPage;
