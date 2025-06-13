import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// --- ICONS ---
const FiMapPin = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const FiClock = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const FiTrendingUp = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>);
const FiUsers = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiExternalLink = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>);


// --- Mock Data (Simulating API calls) ---
const mockMarketsData = {
  'kasuwar-rimi': {
    name: 'Kasuwar Rimi',
    location: 'Rimi, Kano',
    coords: '12.0163,8.5152',
    operatingHours: '7:00 AM - 6:00 PM (Daily)',
    shopOwners: ['Bello Sani (Sani\'s Grains)', 'Musa Ibrahim (Ibrahim & Sons)'],
    recentUpdates: [
      { productId: 1, name: 'Tomatoes (Basket)', price: 15500, shopName: 'Sani\'s Grains', updated: '2 hours ago' },
      { productId: 2, name: 'Rice (50kg Bag)', price: 79000, shopName: 'Musa Ibrahim', updated: '5 hours ago' },
      { productId: 4, name: 'Onions (Bag)', price: 22500, shopName: 'Sani\'s Grains', updated: 'Yesterday' },
    ]
  },
  'sabon-gari': {
    name: 'Sabon Gari Market',
    location: 'Sabon Gari, Kano',
    coords: '11.9964,8.5411',
    operatingHours: '8:00 AM - 7:00 PM (Daily)',
    shopOwners: ['Aisha Lawan (Aisha General Store)'],
    recentUpdates: [
      { productId: 2, name: 'Rice (50kg Bag)', price: 78500, shopName: 'Aisha General Store', updated: '1 hour ago' },
      { productId: 3, name: 'Palm Oil (25L)', price: 43000, shopName: 'Aisha General Store', updated: 'Today' },
    ]
  },
  'yankura': {
    name: 'Yankura Market',
    location: 'Yankura, Kano',
    coords: '11.9833,8.5301',
    operatingHours: '6:00 AM - 5:00 PM (Daily)',
    shopOwners: ['Fatima Bala (Fati\'s Fresh Produce)'],
    recentUpdates: [
      { productId: 1, name: 'Tomatoes (Basket)', price: 14800, shopName: 'Fati\'s Fresh Produce', updated: '45 mins ago' },
      { productId: 6, name: 'Peppers (Bag)', price: 18000, shopName: 'Fati\'s Fresh Produce', updated: '3 hours ago' },
    ]
  },
  'kantin-kwari': {
    name: 'Kantin Kwari',
    location: 'Kwari, Kano',
    coords: '11.9944,8.5222',
    operatingHours: '9:00 AM - 6:00 PM (Mon-Sat)',
    shopOwners: ['Musa Ibrahim (Ibrahim & Sons)'],
    recentUpdates: [
      { productId: 2, name: 'Rice (50kg Bag)', price: 79200, shopName: 'Musa Ibrahim', updated: 'Yesterday' },
      { productId: 7, name: 'Grains (Mudu)', price: 1200, shopName: 'Musa Ibrahim', updated: '2 days ago' },
    ]
  },
};

/**
 * MarketDetailPage Component
 * Displays details for a specific market.
 */
const MarketDetailPage = () => {
  const { marketId } = useParams();
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
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

  const filteredUpdates = market.recentUpdates.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${searchTerm}`);
  };

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
          {/* Left Column for Recent Price Updates */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center whitespace-nowrap">
                  <FiTrendingUp className="h-5 w-5 mr-3 text-green-600" />
                  Recent Price Updates
                </h2>
                <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search products in this market..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </form>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-left bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Shop</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase text-right">Price (NGN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUpdates.length > 0 ? filteredUpdates.map(item => (
                      <tr key={item.productId}>
                        <td className="px-4 py-3 whitespace-nowrap"><Link to={`/search?q=${item.name.toLowerCase()}`} className="text-sm font-medium text-green-600 hover:underline">{item.name}</Link></td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.shopName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{item.updated}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-800 font-mono text-right whitespace-nowrap">{item.price.toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" className="text-center py-8 text-gray-500">No products found for "{searchTerm}".</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column for Market Info and Shop Owners */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Location</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                <img
                  src={`https://placehold.co/600x400/e2e8f0/666666?text=Map+of+\n${market.name.replace(' ', '+')}`}
                  alt={`Map of ${market.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiClock className="h-5 w-5 mr-3 text-green-600" />Market Information</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Operating Hours:</strong><br />{market.operatingHours}</p>
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${market.coords}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800">
                Get Directions <FiExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiUsers className="h-5 w-5 mr-3 text-green-600" />Registered Shops</h2>
              <ul className="space-y-3">
                {market.shopOwners.map(owner => (
                  <li key={owner} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">{owner}</li>
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

