
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- ICONS ---
const FiAlertCircle = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>);
const FiX = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const FiSend = (props) => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);

// --- Mock Data ---
const mockPriceData = {
  'tomatoes': [
    { id: 1, shopOwner: 'Bello Sani', shopName: 'Sani\'s Grains', market: 'Kasuwar Rimi', price: 15500, memberSince: '2023-01-15' },
    { id: 2, shopOwner: 'Fatima Bala', shopName: 'Fati\'s Fresh Produce', market: 'Yankura Market', price: 14800, memberSince: '2022-11-20' },
    { id: 3, shopOwner: 'Aisha Lawan', shopName: 'Aisha General Store', market: 'Sabon Gari Market', price: 15200, memberSince: '2023-03-10' },
  ],
  'rice': [
    { id: 4, shopOwner: 'Aisha Lawan', shopName: 'Aisha General Store', market: 'Sabon Gari Market', price: 78500, memberSince: '2023-03-10' },
    { id: 5, shopOwner: 'Musa Ibrahim', shopName: 'Ibrahim & Sons', market: 'Kantin Kwari', price: 77500, memberSince: '2021-08-05' },
  ],
};
const mockChartData = {
  hourly: [{ name: '8am', price: 14900 }, { name: '10am', price: 15100 }, { name: '12pm', price: 15200 }, { name: '2pm', price: 15300 }, { name: '4pm', price: 15150 }],
  daily: [{ name: 'Mon', price: 14700 }, { name: 'Tue', price: 14800 }, { name: 'Wed', price: 15200 }, { name: 'Thu', price: 15500 }, { name: 'Fri', price: 15300 }],
  weekly: [{ name: 'Wk 1', price: 14000 }, { name: 'Wk 2', price: 14500 }, { name: 'Wk 3', price: 14800 }, { name: 'This Wk', price: 15300 }],
  monthly: [{ name: 'Mar', price: 13500 }, { name: 'Apr', price: 13800 }, { name: 'May', price: 14200 }, { name: 'Jun', price: 15300 }],
};

/**
 * ReportPriceModal Component
 * Allows users to report a new price for a product.
 */
const ReportPriceModal = ({ isOpen, onClose, productName }) => {
  const [formData, setFormData] = useState({ shopName: '', marketName: '', price: '' });
  if (!isOpen) return null;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! Your report for ${productName} has been submitted for verification.`);
    console.log("Price Report Submitted:", { product: productName, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Report a Price</h2>
        <p className="text-gray-600 mb-6">Help the community by reporting a price for <span className="font-semibold capitalize">{productName}</span>.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" name="marketName" placeholder="Market Name" value={formData.marketName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <input type="number" name="price" placeholder="Price (NGN)" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};


/**
 * ShopOwnerInfoModal Component
 */
const ShopOwnerInfoModal = ({ isOpen, onClose, shopData }) => {
  if (!isOpen || !shopData) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX className="h-6 w-6" /></button>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">{shopData.shopName}</h3>
          <p className="text-sm text-gray-500">Owner: {shopData.shopOwner}</p>
          <p className="text-sm text-gray-500">Market: {shopData.market}</p>
          <p className="text-xs text-gray-400 mt-1">Member Since: {shopData.memberSince}</p>
        </div>
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-600">Their price for this item:</p>
          <p className="text-3xl font-bold text-green-600 font-mono">₦{shopData.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * PriceChart Component using Chart.js
 */
const PriceChart = ({ productName }) => {
  const [timeframe, setTimeframe] = useState('daily');
  const chartDataRaw = mockChartData[timeframe];
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: false }, tooltip: { callbacks: { label: (context) => `Price: ₦${context.parsed.y.toLocaleString()}` } } }, scales: { y: { ticks: { callback: (value) => '₦' + value / 1000 + 'k' } } } };
  const data = { labels: chartDataRaw.map(d => d.name), datasets: [{ label: 'Average Price', data: chartDataRaw.map(d => d.price), borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.3 }], };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Average Price Trend for <span className="capitalize">{productName}</span></h2>
      <div className="flex justify-center space-x-2 mb-4">
        {['hourly', 'daily', 'weekly', 'monthly'].map(t => (<button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1 text-sm rounded-full transition-colors ${timeframe === t ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>))}
      </div>
      <div className="h-72"><Line options={options} data={data} /></div>
    </div>
  );
};

/**
 * SearchResultsPage Component
 */
const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const queryKey = query ? query.toLowerCase().split(' ')[0] : '';
      setResults(mockPriceData[queryKey] || []);
      setIsLoading(false);
    }, 1000);
  }, [query]);

  if (isLoading) return <div className="text-center py-20">Loading results...</div>;

  return (
    <>
      <ShopOwnerInfoModal isOpen={!!selectedShop} onClose={() => setSelectedShop(null)} shopData={selectedShop} />
      <ReportPriceModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} productName={query} />

      <div className="bg-gray-100 min-h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Search Results for "<span className="text-green-600 capitalize">{query}</span>"</h1>
            <button onClick={() => setIsReportModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 shadow-sm transition-colors">
              <FiSend className="h-5 w-5 mr-2" />
              Report a Different Price
            </button>
          </div>
          {results.length > 0 ? (
            <>
              <PriceChart productName={query} />
              <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-left bg-gray-50"><tr><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Shop Name</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Shop Owner</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Market</th><th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Price (NGN)</th></tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((item) => (
                      <tr key={item.id} onClick={() => setSelectedShop(item)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.shopName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.shopOwner}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.market}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-800 font-mono">{item.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
              <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Prices Found</h3>
              <p className="mt-1 text-sm text-gray-500">We couldn't find any current prices for "{query}". Please try another search or report a price.</p>
              <Link to="/" className="inline-block mt-6 px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">Back to Home</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;
