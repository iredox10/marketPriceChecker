
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure leaflet's CSS is imported
// Import the necessary API service functions
import { getMarketById, getProducts } from '../../services/api';

// --- ICONS ---
const FiMapPin = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const FiUsers = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const FiSearch = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const FiExternalLink = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>);
const FiAlertTriangle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const FiShoppingBag = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>);

/**
 * MarketDetailPage Component
 * Displays details for a specific market fetched from the backend.
 */
const MarketDetailPage = () => {
  const { marketId } = useParams();
  const [market, setMarket] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState(''); // State for the new search bar
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch market details and all products for that market concurrently
        const [marketRes, productsRes] = await Promise.all([
          getMarketById(marketId),
          getProducts({ market: marketId })
        ]);

        setMarket(marketRes.data);
        setMarketProducts(productsRes.data);

      } catch (err) {
        console.error("Failed to fetch market data:", err);
        setError("Could not load market details. The market may not exist or there was a server issue.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [marketId]);

  // Memoized filtering for performance
  const filteredMarketProducts = useMemo(() => {
    return marketProducts.filter(product =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [marketProducts, productSearchTerm]);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading market details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white m-8 rounded-lg shadow-md">
        <FiAlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-xl font-semibold text-red-600">Market Not Found</h2>
        <p className="mt-2 text-gray-600">We couldn't find the market you were looking for.</p>
        <Link to="/markets" className="inline-block mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
          Back to All Markets
        </Link>
      </div>
    );
  }

  if (!market) {
    return null; // Should be handled by loading/error states
  }

  const mapPosition = market.coordinates?.lat && market.coordinates?.lng ? [market.coordinates.lat, market.coordinates.lng] : [12.0022, 8.5167];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-64 bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590312524159-8549a164b36b?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">{market.name}</h1>
          <p className="text-lg text-gray-200 mt-2 flex items-center drop-shadow-md"><FiMapPin className="h-5 w-5 mr-2" />{market.location}</p>
        </div>
      </section>

      <div className="bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-20 relative z-20">
            <div className="bg-white p-5 rounded-lg shadow-lg flex items-center"><div className="bg-green-100 p-3 rounded-full mr-4"><FiUsers className="h-6 w-6 text-green-600" /></div><div><p className="text-gray-500 text-sm">Registered Shops</p><p className="font-bold text-2xl">{market.shopOwners.length}</p></div></div>
            <div className="bg-white p-5 rounded-lg shadow-lg flex items-center"><div className="bg-green-100 p-3 rounded-full mr-4"><FiShoppingBag className="h-6 w-6 text-green-600" /></div><div><p className="text-gray-500 text-sm">Products Tracked</p><p className="font-bold text-2xl">{marketProducts.length}</p></div></div>
            <div className="bg-white p-5 rounded-lg shadow-lg flex items-center"><div className="bg-green-100 p-3 rounded-full mr-4"><FiExternalLink className="h-6 w-6 text-green-600" /></div><div><p className="text-gray-500 text-sm">Get Directions</p><a href={`https://www.google.com/maps/search/?api=1&query=${market.location}`} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-green-600 hover:underline">Open in Maps</a></div></div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">Recently Updated Products</h2>
                  <div className="relative w-full sm:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-left bg-gray-50"><tr><th className="px-4 py-2 text-xs font-medium uppercase">Product</th><th className="px-4 py-2 text-xs font-medium uppercase">Last Updated</th><th className="px-4 py-2 text-xs font-medium uppercase text-right">Average Price</th></tr></thead>
                    <tbody className="divide-y">
                      {filteredMarketProducts.slice(0, 10).map(product => (
                        <tr key={product._id}><td className="px-4 py-3"><Link to={`/search?q=${product.name}`} className="text-sm font-medium text-green-600 hover:underline">{product.name}</Link></td><td className="px-4 py-3 text-sm text-gray-500">{new Date(product.updatedAt).toLocaleDateString()}</td><td className="px-4 py-3 text-sm font-bold text-right font-mono">₦{product.averagePrice.toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Market Details</h2>
                <p className="text-sm text-gray-600">{market.description || 'No description available for this market.'}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Shops</h2>
                <ul className="space-y-2">
                  {market.shopOwners.map(owner => (
                    <li key={owner._id} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">{owner.shopName || owner.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketDetailPage;
